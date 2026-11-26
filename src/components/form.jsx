import { useRef, useState } from "react";
import { AlertCircle, Check, ChevronDown, FileText, Loader2, Phone, UploadCloud, X } from "lucide-react";
import { BTN_PRIMARY } from "./ui.jsx";
import { CONTACT } from "../content.js";
import { mailtoFallback, sendForm } from "../send.js";

/**
 * Shared form kit used by every enquiry form on the site, so they all behave the same:
 * required fields marked in text and in code, errors summarised and announced, focus moved
 * to the first invalid field, a sending state, a success summary, and a mailto fallback
 * that keeps what the visitor typed if sending fails.
 */

export const INPUT =
  "w-full rounded-xl border border-slate-500 bg-white px-4 py-3 text-[15px] text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/50 aria-[invalid=true]:border-rose-600";

export const RESUME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
export const RESUME_MAX = 3 * 1024 * 1024;
export const checkResume = (file) =>
  !file
    ? "Please attach your résumé."
    : !RESUME_TYPES.includes(file.type)
      ? "Résumé must be a PDF, DOC or DOCX file."
      : file.size > RESUME_MAX
        ? "Résumé must be 3 MB or smaller."
        : null;

export const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s).trim());
export const isPhone = (s) => /^\+?[\d\s()-]{8,}$/.test(String(s).trim()) && String(s).replace(/\D/g, "").length >= 8;

/**
 * Form state + submission.
 *  - `validate(values)` → { field: message }
 *  - `build(values)` → { subject, fields: [[label, value]…], replyTo?, file? } for the email
 *  - `prefix` makes field ids unique per form (several forms can share a page)
 */
export function useForm({ form, prefix, initial, validate, build }) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [message, setMessage] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [progress, setProgress] = useState(0);
  const [sent, setSent] = useState(null); // the [label, value] pairs that went out
  const formRef = useRef(null);
  const honeypot = useRef(null);

  const id = (k) => `${prefix}-${k}`;
  const setValue = (k, v) => {
    setValues((s) => ({ ...s, [k]: v }));
    setErrors((er) => {
      if (!er[k]) return er;
      const next = { ...er };
      delete next[k];
      return next;
    });
  };
  const set = (k) => (e) => setValue(k, e.target.type === "checkbox" ? e.target.checked : e.target.value);

  /** Props for <Field>: id, value, onChange, error, tick when valid after a submit attempt, shake key. */
  const field = (k) => ({
    id: id(k),
    value: values[k],
    onChange: set(k),
    error: errors[k],
    valid: attempt > 0 && !errors[k] && String(values[k] ?? "").trim() !== "",
    shake: attempt,
  });

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (status === "sending") return;
    const e = validate(values);
    setErrors(e);
    setAttempt((a) => a + 1);
    if (Object.keys(e).length) {
      requestAnimationFrame(() => formRef.current?.querySelector('[aria-invalid="true"]')?.focus());
      return;
    }
    const mail = build(values);
    setStatus("sending");
    setProgress(0);
    try {
      await sendForm({ form, ...mail, website: honeypot.current?.value, onProgress: setProgress });
      setSent(mail.fields.filter(([, v]) => String(v ?? "").trim()));
      setStatus("sent");
      setValues(initial);
      setAttempt(0);
    } catch (err) {
      setMessage(err.message);
      setStatus("error");
    }
  };

  const reset = () => {
    setStatus("idle");
    setSent(null);
  };

  const fallback = () => {
    const mail = build(values);
    return mailtoFallback(mail.subject, mail.fields);
  };

  return { values, setValue, set, field, errors, status, message, progress, sent, formRef, honeypot, onSubmit, reset, fallback, id };
}

/** Label + control + error, with required/optional marking in text and in code. */
export function Field({ id, label, error, valid, shake = 0, required, optional, hint, as: Tag = "input", className = "", children, ...props }) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  const select = Tag === "select";
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 flex flex-wrap items-baseline gap-x-1 text-sm font-medium text-slate-800">
        {label}
        {required && (
          <span aria-hidden className="text-rose-700">
            *
          </span>
        )}
        {optional && <span className="font-normal text-slate-600">(optional)</span>}
      </label>
      <div className="relative">
        <Tag
          id={id}
          required={required}
          aria-required={required || undefined}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={`${INPUT} ${select ? "cursor-pointer appearance-none pr-10" : ""} ${valid && !select ? "pr-10" : ""} ${
            error ? (shake % 2 ? "motion-safe:animate-[shake-a_0.35s]" : "motion-safe:animate-[shake-b_0.35s]") : ""
          } ${Tag === "textarea" ? "resize-y" : ""}`}
          {...props}
        >
          {children}
        </Tag>
        {select && <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-600" aria-hidden />}
        {valid && !select && (
          <Check className="pointer-events-none absolute right-3.5 top-3.5 size-4 text-emerald-700 motion-safe:animate-[pop-in_0.25s_ease-out]" aria-hidden />
        )}
      </div>
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-slate-600">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex items-start gap-1.5 text-sm text-rose-700">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
}

/** One-line instruction shown at the top of every form. */
export function RequiredNote() {
  return (
    <p className="text-sm text-slate-600">
      Fields marked <span className="text-rose-700">*</span> are required.
    </p>
  );
}

/** Lists every error at once (announced), each linking to its field. */
export function ErrorSummary({ errors, id }) {
  const list = Object.entries(errors);
  if (!list.length) return null;
  return (
    <div role="alert" className="rounded-xl border border-rose-300 bg-rose-50 p-4 text-sm text-rose-800">
      <p className="font-semibold">
        Please fix {list.length} {list.length === 1 ? "field" : "fields"}:
      </p>
      <ul className="mt-1.5 list-disc space-y-0.5 pl-5">
        {list.map(([k, m]) => (
          <li key={k}>
            <a
              href={`#${id(k)}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(id(k))?.focus();
              }}
              className="underline underline-offset-2 hover:text-rose-950"
            >
              {m}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Hidden field bots fill in and people never see. */
export function Honeypot({ inputRef }) {
  return (
    <div aria-hidden className="absolute -left-[9999px] size-px overflow-hidden">
      <label>
        Website
        <input ref={inputRef} type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

/** Submit button with idle → sending (spinner + upload %) states. */
export function SubmitButton({ status, progress = 0, children, className = "" }) {
  const sending = status === "sending";
  return (
    <button type="submit" aria-disabled={sending} className={`${BTN_PRIMARY} w-full ${sending ? "cursor-wait opacity-90" : ""} ${className}`}>
      {sending ? (
        <>
          <Loader2 className="size-4 motion-safe:animate-spin" aria-hidden />
          <span>Sending{progress > 0 && progress < 1 ? ` ${Math.round(progress * 100)}%` : "…"}</span>
        </>
      ) : (
        children
      )}
      <span className="sr-only" aria-live="polite">
        {sending ? "Sending your message" : ""}
      </span>
    </button>
  );
}

/** Shown when sending fails: what went wrong, and two other ways to reach us. The form keeps its values. */
export function SendError({ message, href }) {
  return (
    <div role="alert" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
      <p className="font-semibold">{message}</p>
      <p className="mt-1">
        Your details are still in the form. Try again, or{" "}
        <a href={href} className="font-semibold underline underline-offset-2">
          email them to {CONTACT.emails[0]}
        </a>{" "}
        or call{" "}
        <a href={`tel:${CONTACT.phones[0].replace(/[^\d+]/g, "")}`} className="font-semibold underline underline-offset-2">
          {CONTACT.phones[0]}
        </a>
        .
      </p>
    </div>
  );
}

/** Confirmation with a drawn tick and a summary of what was sent. Takes focus so it's announced. */
export function SuccessPanel({ title = "Thank you — your message has been sent.", text, sent, action }) {
  const ref = useRef(null);
  return (
    <div
      ref={(el) => {
        if (el && el !== ref.current) {
          ref.current = el;
          requestAnimationFrame(() => el.focus());
        }
      }}
      tabIndex={-1}
      role="status"
      className="flex flex-col items-center rounded-2xl bg-emerald-50 px-6 py-10 text-center outline-none motion-safe:animate-[fade-up_0.35s_ease-out]"
    >
      <svg viewBox="0 0 52 52" className="size-14 text-emerald-700" aria-hidden>
        <circle cx="26" cy="26" r="24" fill="none" stroke="currentColor" strokeWidth="2.5" className="draw-stroke" style={{ "--len": 151 }} />
        <path d="M15 27l7 7 15-15" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="draw-stroke" style={{ "--len": 36, animationDelay: "0.35s" }} />
      </svg>
      <p className="mt-4 text-lg font-semibold text-slate-900">{title}</p>
      {text && <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-slate-700">{text}</p>}
      {sent?.length > 0 && (
        <dl className="mt-6 w-full max-w-md divide-y divide-emerald-100 rounded-xl bg-white text-left text-sm ring-1 ring-emerald-100">
          {sent.map(([l, v]) => (
            <div key={l} className="flex gap-3 px-4 py-2.5">
              <dt className="w-32 shrink-0 text-slate-600">{l}</dt>
              <dd className="min-w-0 whitespace-pre-wrap break-words font-medium text-slate-900">{String(v)}</dd>
            </div>
          ))}
        </dl>
      )}
      {action}
    </div>
  );
}

const kb = (n) => (n < 1024 * 1024 ? `${Math.max(1, Math.round(n / 1024))} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`);

/** Résumé picker: drag-and-drop or browse, then a file card with an upload bar while sending. */
export function ResumeField({ id, label = "Résumé / CV", file, onFile, error, sending, progress, shake = 0 }) {
  const [over, setOver] = useState(false);
  const describedBy = [`${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ");
  return (
    <div>
      <p id={`${id}-label`} className="mb-1.5 flex items-baseline gap-1 text-sm font-medium text-slate-800">
        {label} <span aria-hidden className="text-rose-700">*</span>
      </p>
      {file ? (
        <div className="motion-safe:animate-[fade-up_0.3s_ease-out] rounded-xl border border-emerald-600/50 bg-emerald-50/70 px-4 py-3">
          <div className="flex items-center gap-3">
            <FileText className="size-5 shrink-0 text-emerald-700" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">{file.name}</p>
              <p className="text-xs text-slate-600">{kb(file.size)}</p>
            </div>
            {!sending && (
              <button
                type="button"
                onClick={() => onFile(null)}
                aria-label={`Remove ${file.name}`}
                className="grid size-9 place-items-center rounded-full text-slate-600 transition-colors hover:bg-white hover:text-rose-700"
              >
                <X className="size-4" aria-hidden />
              </button>
            )}
          </div>
          {sending && (
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-emerald-100" role="progressbar" aria-label="Uploading résumé" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
              <div className="h-full origin-left rounded-full bg-emerald-700 transition-transform duration-200" style={{ transform: `scaleX(${progress})` }} />
            </div>
          )}
        </div>
      ) : (
        <label
          htmlFor={id}
          onDragOver={(e) => {
            e.preventDefault();
            setOver(true);
          }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setOver(false);
            onFile(e.dataTransfer.files?.[0] || null);
          }}
          className={`flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed px-6 py-7 text-center transition-colors focus-within:border-emerald-700 focus-within:ring-2 focus-within:ring-emerald-700/50 ${
            over
              ? "border-emerald-600 bg-emerald-50 motion-safe:animate-pulse"
              : error
                ? `border-rose-600 bg-rose-50/40 ${shake % 2 ? "motion-safe:animate-[shake-a_0.35s]" : "motion-safe:animate-[shake-b_0.35s]"}`
                : "border-slate-500 bg-slate-50 hover:border-emerald-600"
          }`}
        >
          <UploadCloud className={`size-7 ${over ? "text-emerald-700" : "text-slate-600"}`} strokeWidth={1.5} aria-hidden />
          <span className="mt-2 text-sm font-semibold text-slate-900">
            Drop your résumé here or <span className="text-emerald-700 underline underline-offset-2">browse</span>
          </span>
          <span id={`${id}-hint`} className="mt-1 text-xs text-slate-600">
            PDF, DOC or DOCX, up to 3 MB
          </span>
          <input
            id={id}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => onFile(e.target.files?.[0] || null)}
            aria-labelledby={`${id}-label`}
            aria-required="true"
            aria-invalid={!!error}
            aria-describedby={describedBy}
            className="sr-only"
          />
        </label>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex items-start gap-1.5 text-sm text-rose-700">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
}

/** Small "or call us" line under forms. */
export function CallLine() {
  return (
    <p className="flex items-center justify-center gap-1.5 text-sm text-slate-600">
      <Phone className="size-3.5" aria-hidden /> Prefer to talk?{" "}
      <a href={`tel:${CONTACT.phones[0].replace(/[^\d+]/g, "")}`} className="font-semibold text-emerald-800 underline-offset-2 hover:underline">
        {CONTACT.phones[0]}
      </a>
    </p>
  );
}
