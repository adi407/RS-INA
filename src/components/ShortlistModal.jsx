import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, Send, X } from "lucide-react";
import { BTN_PRIMARY } from "./ui.jsx";
import { getLenis } from "../motion.js";
import { CONTACT, EMPLOYERS, REGIONS } from "../content.js";

const EMPTY = { company: "", name: "", email: "", phone: "", headcount: "", region: "middle-east", message: "" };

/**
 * "Request Talent Shortlist" dialog, opened from a sector card's "Know More".
 * No backend yet: submitting opens the visitor's email app with a pre-filled request
 * to the agency inbox (same approach as the homepage inquiry form).
 * Accessible dialog: focus moves in and is kept inside, Esc / backdrop close,
 * page scroll is locked, and focus returns to the button that opened it.
 */
export default function ShortlistModal({ sectorId, onClose, onChangeSector }) {
  const open = !!sectorId;
  const dialogRef = useRef(null);
  const returnFocus = useRef(null);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement;
    setSent(false);
    setErrors({});
    document.body.style.overflow = "hidden";
    getLenis()?.stop();
    const t = setTimeout(() => dialogRef.current?.querySelector("input, select, textarea, button")?.focus(), 50);

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab") return;
      // Keep Tab focus inside the dialog
      const f = [...dialogRef.current.querySelectorAll("button, input, select, textarea, a[href]")].filter((el) => !el.disabled);
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      getLenis()?.start();
      returnFocus.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;
  const sector = EMPLOYERS.sectors.find((s) => s.id === sectorId);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (ev) => {
    ev.preventDefault();
    const e = {};
    if (!form.company.trim()) e.company = "Please enter your company.";
    if (!form.name.trim()) e.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = "Enter a valid email address.";
    if (!/^[+\d][\d\s-]{7,}$/.test(form.phone.trim())) e.phone = "Enter a valid phone number.";
    if (!(Number(form.headcount) > 0)) e.headcount = "How many workers do you need?";
    setErrors(e);
    if (Object.keys(e).length) return;

    const destination = REGIONS.find((r) => r.id === form.region)?.label;
    const body = [
      `Company: ${form.company}`,
      `Contact person: ${form.name}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      `Sector: ${sector.title}`,
      `Headcount: ${form.headcount}`,
      `Destination: ${destination}`,
      "",
      form.message,
    ].join("\n");
    window.location.href = `mailto:${CONTACT.emails[0]}?subject=${encodeURIComponent(
      `Talent shortlist request — ${sector.title}`
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
    setForm(EMPTY);
  };

  const input =
    "w-full rounded-xl border bg-white px-4 py-2.5 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15";
  const field = (k, label, props = {}) => (
    <div>
      <label htmlFor={`sl-${k}`} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={`sl-${k}`}
        value={form[k]}
        onChange={set(k)}
        aria-invalid={!!errors[k]}
        aria-describedby={errors[k] ? `sle-${k}` : undefined}
        className={`${input} ${errors[k] ? "border-rose-400" : "border-slate-300"}`}
        {...props}
      />
      {errors[k] && (
        <p id={`sle-${k}`} className="mt-1 text-xs text-rose-600">
          {errors[k]}
        </p>
      )}
    </div>
  );

  // Portal to <body>: inside <main> (its own stacking layer) the sticky navbar would sit on top
  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-[#0A0F1D]/60 backdrop-blur-sm motion-safe:animate-[fade-up_0.25s_ease-out]"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortlist-title"
        data-lenis-prevent
        className="relative max-h-[92svh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl shadow-black/40 sm:rounded-3xl motion-safe:animate-[fade-up_0.35s_ease-out]"
      >
        {/* Header with the sector photo */}
        <div className="relative h-32 overflow-hidden sm:h-36">
          <img src={sector.image} alt="" className="size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1D]/90 via-[#0A0F1D]/40 to-[#0A0F1D]/10" />
          <div className="absolute inset-x-6 bottom-4 text-white">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-300">{sector.title} · Verified Pool</p>
            <h2 id="shortlist-title" className="mt-1 font-display text-2xl font-bold tracking-tight">
              Request Talent Shortlist
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="size-5" />
          </button>
        </div>

        {sent ? (
          <div role="status" className="flex flex-col items-center px-6 py-12 text-center">
            <CheckCircle2 className="size-12 text-emerald-600" strokeWidth={1.5} />
            <p className="mt-4 text-lg font-semibold text-slate-900">Your email app should now be open.</p>
            <p className="mt-2 max-w-sm text-sm text-slate-600">
              Send the pre-filled request to {CONTACT.emails[0]}, or call {CONTACT.phones[0]}. Our team will share a {sector.title.toLowerCase()} shortlist.
            </p>
            <button type="button" onClick={onClose} className={`${BTN_PRIMARY} mt-7`}>
              Done
            </button>
          </div>
        ) : (
          <form noValidate onSubmit={submit} className="space-y-4 p-6 sm:p-8">
            <p className="text-sm text-slate-600">
              Tell us your requirement and we'll share pre-screened candidate profiles from our{" "}
              <span className="font-semibold text-slate-900">{sector.title.toLowerCase()}</span> pool.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {field("company", "Company", { autoComplete: "organization" })}
              {field("name", "Contact person", { autoComplete: "name" })}
              {field("email", "Email", { type: "email", autoComplete: "email" })}
              {field("phone", "Phone", { type: "tel", autoComplete: "tel" })}
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="sl-sector" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Sector
                </label>
                <select id="sl-sector" value={sectorId} onChange={(e) => onChangeSector(e.target.value)} className={`${input} cursor-pointer border-slate-300`}>
                  {EMPLOYERS.sectors.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>
              {field("headcount", "Headcount", { type: "number", min: 1, inputMode: "numeric" })}
              <div>
                <label htmlFor="sl-region" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Destination
                </label>
                <select id="sl-region" value={form.region} onChange={set("region")} className={`${input} cursor-pointer border-slate-300`}>
                  {REGIONS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="sl-message" className="mb-1.5 block text-sm font-medium text-slate-700">
                Requirement details <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <textarea id="sl-message" rows={3} value={form.message} onChange={set("message")} className={`${input} resize-none border-slate-300`} />
            </div>
            <button type="submit" className={`${BTN_PRIMARY} w-full`}>
              Request Shortlist
              <Send className="size-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
