import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BadgeCheck, Briefcase, CalendarDays, CheckCircle2, Clock, MapPin, Send, ShieldCheck, Wallet, X } from "lucide-react";
import { BTN_PRIMARY } from "./ui.jsx";
import useDialog from "../useDialog.js";
import { CONTACT, LICENSE } from "../content.js";

const EMPTY = { name: "", email: "", phone: "", bio: "", consent: false };

/**
 * Slide-over job details drawer: full breakdown, MEA licence compliance card and an
 * "Apply for Position" form (the old site's fields: name, email, phone, bio, consent).
 * No backend yet: submitting opens the visitor's email app with the application filled
 * in, addressed to the agency; the candidate attaches their CV there.
 */
export default function JobDrawer({ job, onClose }) {
  const open = !!job;
  const ref = useDialog(open, onClose);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (open) {
      setSent(false);
      setErrors({});
    }
  }, [open, job?.id]);

  if (!open) return null;
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: k === "consent" ? e.target.checked : e.target.value }));

  const submit = (ev) => {
    ev.preventDefault();
    const e = {};
    if (!form.name.trim()) e.name = "Please enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = "Enter a valid email address.";
    if (!/^[+\d][\d\s-]{7,}$/.test(form.phone.trim())) e.phone = "Enter a valid phone number.";
    if (!form.bio.trim()) e.bio = "Tell us briefly about your experience.";
    if (!form.consent) e.consent = "Please agree so we can handle your application.";
    setErrors(e);
    if (Object.keys(e).length) return;
    const body = [
      `Position: ${job.title}`,
      `Category: ${job.category} · Location: ${job.location} · ${job.type}`,
      "",
      `Full name: ${form.name}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      "",
      form.bio,
      "",
      "(CV / resume attached)",
    ].join("\n");
    window.location.href = `mailto:${CONTACT.emails[0]}?subject=${encodeURIComponent(`Job application — ${job.title}`)}&body=${encodeURIComponent(body)}`;
    setSent(true);
    setForm(EMPTY);
  };

  const input =
    "w-full rounded-xl border bg-white px-4 py-2.5 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15";
  const err = (k) =>
    errors[k] && (
      <p id={`je-${k}`} className="mt-1 text-xs text-rose-600">
        {errors[k]}
      </p>
    );
  const field = (k, label, props = {}) => (
    <div>
      <label htmlFor={`jf-${k}`} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label} <span className="text-rose-500">*</span>
      </label>
      <input
        id={`jf-${k}`}
        value={form[k]}
        onChange={set(k)}
        aria-invalid={!!errors[k]}
        aria-describedby={errors[k] ? `je-${k}` : undefined}
        className={`${input} ${errors[k] ? "border-rose-400" : "border-slate-300"}`}
        {...props}
      />
      {err(k)}
    </div>
  );

  const facts = [
    { icon: Briefcase, label: "Category", value: job.category },
    { icon: MapPin, label: "Location", value: job.location },
    { icon: Clock, label: "Job type", value: job.type },
    { icon: CalendarDays, label: "Posted", value: job.posted },
  ];

  // Portal to <body>: inside <main> (its own stacking layer) the sticky navbar would sit on top
  return createPortal(
    <div className="fixed inset-0 z-[60] flex justify-end">
      <button
        type="button"
        aria-label="Close"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-[#0A0F1D]/60 backdrop-blur-sm motion-safe:animate-[fade-in_0.25s_ease-out]"
      />
      <aside
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="job-title"
        data-lenis-prevent
        className="relative flex h-full w-full max-w-xl flex-col bg-white shadow-2xl shadow-black/40 motion-safe:animate-[slide-in_0.35s_cubic-bezier(0.2,0.7,0.2,1)]"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 bg-[#0A0F1D] px-6 py-6 text-white sm:px-8">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">Job details</p>
            <h2 id="job-title" className="mt-2 font-display text-xl font-bold leading-snug tracking-tight sm:text-2xl">
              {job.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close job details"
            className="grid size-10 shrink-0 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-7 sm:px-8">
          {/* Key facts */}
          <dl className="grid grid-cols-2 gap-3">
            {facts.map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-xl border border-slate-200/80 bg-slate-50 px-4 py-3">
                <dt className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <Icon className="size-3.5 text-emerald-600" aria-hidden />
                  {label}
                </dt>
                <dd className="mt-1 text-sm font-semibold uppercase tracking-wide text-slate-900">{value}</dd>
              </div>
            ))}
          </dl>

          {/* Role */}
          <h3 className="mt-8 font-display text-lg font-semibold text-slate-900">About the role</h3>
          {job.summary && <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{job.summary}</p>}
          {job.points.length > 0 && (
            <ul className="mt-3 space-y-2.5">
              {job.points.map((p) => (
                <li key={p} className="flex gap-3 text-[15px] leading-relaxed text-slate-600">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
          )}
          {job.salary && (
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1.5 text-sm font-semibold text-emerald-700">
              <Wallet className="size-4" aria-hidden />
              Salary: {job.salary}
            </p>
          )}

          {/* Compliance */}
          <div className="mt-8 flex gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white">
              <ShieldCheck className="size-5" aria-hidden />
            </span>
            <div>
              <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                Government-approved recruitment
                <BadgeCheck className="size-4 text-emerald-600" aria-hidden />
              </p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                Approved by the Govt. of India, Ministry of External Affairs. Visa processing and mobilization handled end to end.
              </p>
              <p className="mt-2 text-sm font-semibold text-emerald-700 [overflow-wrap:anywhere]">License No: {LICENSE}</p>
            </div>
          </div>

          {/* Apply */}
          <h3 className="mt-10 font-display text-lg font-semibold text-slate-900">Apply for Position</h3>
          {sent ? (
            <div role="status" className="mt-4 flex flex-col items-center rounded-2xl bg-emerald-50 px-6 py-10 text-center">
              <CheckCircle2 className="size-10 text-emerald-600" strokeWidth={1.5} />
              <p className="mt-4 font-semibold text-slate-900">Your email app should now be open.</p>
              <p className="mt-1.5 max-w-sm text-sm text-slate-600">
                Attach your CV / resume (PDF or Word) and send it to {CONTACT.emails[0]}, or call {CONTACT.phones[0]}.
              </p>
            </div>
          ) : (
            <form noValidate onSubmit={submit} className="mt-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {field("name", "Full Name", { autoComplete: "name" })}
                {field("phone", "Phone", { type: "tel", autoComplete: "tel" })}
              </div>
              {field("email", "Email", { type: "email", autoComplete: "email" })}
              <div>
                <label htmlFor="jf-bio" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Bio <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="jf-bio"
                  rows={4}
                  value={form.bio}
                  onChange={set("bio")}
                  placeholder="Your trade, years of experience and current location"
                  aria-invalid={!!errors.bio}
                  aria-describedby={errors.bio ? "je-bio" : undefined}
                  className={`${input} resize-none ${errors.bio ? "border-rose-400" : "border-slate-300"}`}
                />
                {err("bio")}
              </div>
              <p className="rounded-xl bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-500">
                Your CV / resume (PDF, DOC or DOCX): attach it in the email that opens when you submit.
              </p>
              <div>
                <label className="flex items-start gap-2.5 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={form.consent}
                    onChange={set("consent")}
                    aria-invalid={!!errors.consent}
                    aria-describedby={errors.consent ? "je-consent" : undefined}
                    className="mt-0.5 size-4 shrink-0 accent-emerald-600"
                  />
                  By using this form you agree with the storage and handling of your data by this website.
                </label>
                {err("consent")}
              </div>
              <button type="submit" className={`${BTN_PRIMARY} w-full`}>
                Apply for Position
                <Send className="size-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </form>
          )}
        </div>
      </aside>
    </div>,
    document.body
  );
}
