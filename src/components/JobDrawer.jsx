import { useEffect } from "react";
import { createPortal } from "react-dom";
import { BadgeCheck, Briefcase, CalendarDays, CheckCircle2, Clock, MapPin, Send, ShieldCheck, Wallet, X } from "lucide-react";
import useDialog from "../useDialog.js";
import { CallLine, ErrorSummary, Field, Honeypot, RequiredNote, ResumeField, SendError, SubmitButton, SuccessPanel, checkResume, isEmail, isPhone, useForm } from "./form.jsx";
import { LICENSE } from "../content.js";

const EMPTY = { name: "", email: "", phone: "", bio: "", resume: null, consent: false };

/**
 * Job details drawer (slides in from the right): key facts, the role, compliance note,
 * and an application form that sends the résumé as an attachment through /api/send.
 */
export default function JobDrawer({ job, onClose }) {
  const open = !!job;
  const ref = useDialog(open, onClose);

  const f = useForm({
    form: "job-application",
    prefix: "jf",
    initial: EMPTY,
    validate: (v) => {
      const e = {};
      if (!v.name.trim()) e.name = "Enter your full name.";
      if (!isPhone(v.phone)) e.phone = "Enter a phone number with at least 8 digits.";
      if (!isEmail(v.email)) e.email = "Enter an email address like name@example.com.";
      if (!v.bio.trim()) e.bio = "Tell us briefly about your experience.";
      const r = checkResume(v.resume);
      if (r) e.resume = r;
      if (!v.consent) e.consent = "Please agree to the privacy policy so we can process your application.";
      return e;
    },
    build: (v) => ({
      subject: `Job application — ${job.title}`,
      replyTo: v.email,
      file: v.resume,
      fields: [
        ["Position", job.title],
        ["Category", job.category],
        ["Location", job.location],
        ["Job type", job.type],
        ["Full name", v.name],
        ["Email", v.email],
        ["Phone", v.phone],
        ["Experience", v.bio],
        ["Résumé", v.resume?.name],
      ],
    }),
  });

  const { reset } = f;
  useEffect(() => {
    if (open) reset();
  }, [open, job?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) return null;

  const facts = [
    { icon: Briefcase, label: "Category", value: job.category },
    { icon: MapPin, label: "Location", value: job.location },
    { icon: Clock, label: "Job type", value: job.type },
    { icon: CalendarDays, label: "Posted", value: job.posted },
  ];

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
        className="relative flex h-full w-full max-w-xl flex-col bg-white shadow-2xl shadow-black/40 motion-safe:animate-[slide-in_0.35s_cubic-bezier(0.2,0.7,0.2,1)]"
      >
        <div className="flex items-start justify-between gap-4 bg-[#0A0F1D] px-6 py-6 text-white sm:px-8">
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
            className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-7 sm:px-8">
          <dl className="grid grid-cols-2 gap-3">
            {facts.map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <dt className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                  <Icon className="size-3.5 text-emerald-700" aria-hidden />
                  {label}
                </dt>
                <dd className="mt-1 text-sm font-semibold text-slate-900">{value}</dd>
              </div>
            ))}
          </dl>

          <h3 className="mt-8 font-display text-lg font-semibold text-slate-900">About the role</h3>
          {job.summary && <p className="mt-3 text-[15px] leading-relaxed text-slate-700">{job.summary}</p>}
          {job.points.length > 0 && (
            <ul className="mt-3 space-y-2.5">
              {job.points.map((p) => (
                <li key={p} className="flex gap-3 text-[15px] leading-relaxed text-slate-700">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-700" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
          )}
          {job.salary && (
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1.5 text-sm font-semibold text-emerald-800">
              <Wallet className="size-4" aria-hidden />
              Salary: {job.salary}
            </p>
          )}

          <div className="mt-8 flex gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-700 text-white">
              <ShieldCheck className="size-5" aria-hidden />
            </span>
            <div>
              <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                Government-approved recruitment
                <BadgeCheck className="size-4 text-emerald-700" aria-hidden />
              </p>
              <p className="mt-1 text-sm leading-relaxed text-slate-700">
                Approved by the Govt. of India, Ministry of External Affairs. Visa processing and mobilization handled end to end.
              </p>
              <p className="mt-2 text-sm font-semibold text-emerald-800 [overflow-wrap:anywhere]">License No: {LICENSE}</p>
            </div>
          </div>

          <h3 className="mt-10 font-display text-lg font-semibold text-slate-900">Apply for this position</h3>
          {f.status === "sent" ? (
            <div className="mt-4">
              <SuccessPanel title="Application sent — thank you." text="Our recruitment team will contact you about this role." sent={f.sent} />
            </div>
          ) : (
            <form ref={f.formRef} noValidate onSubmit={f.onSubmit} className="relative mt-4 space-y-4">
              <RequiredNote />
              <ErrorSummary errors={f.errors} id={f.id} />
              <Honeypot inputRef={f.honeypot} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field {...f.field("name")} label="Full name" required autoComplete="name" />
                <Field {...f.field("phone")} label="Phone" required type="tel" autoComplete="tel" inputMode="tel" />
              </div>
              <Field {...f.field("email")} label="Email" required type="email" autoComplete="email" />
              <Field
                {...f.field("bio")}
                valid={false}
                as="textarea"
                rows={4}
                required
                label="Your experience"
                hint="Your trade, years of experience and current location."
              />
              <ResumeField
                id="jf-resume"
                file={f.values.resume}
                onFile={(file) => f.setValue("resume", file)}
                error={f.errors.resume}
                shake={f.field("resume").shake}
                sending={f.status === "sending"}
                progress={f.progress}
              />
              <div>
                <label className="flex items-start gap-3 text-sm text-slate-700">
                  <input
                    id="jf-consent"
                    type="checkbox"
                    checked={f.values.consent}
                    onChange={f.set("consent")}
                    aria-required="true"
                    aria-invalid={!!f.errors.consent}
                    aria-describedby={f.errors.consent ? "jf-consent-error" : undefined}
                    className="mt-0.5 size-5 shrink-0 accent-emerald-700"
                  />
                  <span>
                    I agree that RS International may use these details to process my application, as described in the{" "}
                    <a href="/privacy" target="_blank" rel="noopener" className="font-semibold text-emerald-800 underline underline-offset-2">
                      privacy policy
                    </a>
                    . <span aria-hidden className="text-rose-700">*</span>
                  </span>
                </label>
                {f.errors.consent && (
                  <p id="jf-consent-error" className="mt-1.5 text-sm text-rose-700">
                    {f.errors.consent}
                  </p>
                )}
              </div>
              {f.status === "error" && <SendError message={f.message} href={f.fallback()} />}
              <SubmitButton status={f.status} progress={f.progress}>
                Apply for this position
                <Send className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </SubmitButton>
              <CallLine />
            </form>
          )}
        </div>
      </aside>
    </div>,
    document.body
  );
}
