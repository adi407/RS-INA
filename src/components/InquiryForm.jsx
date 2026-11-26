import { useEffect } from "react";
import { Send } from "lucide-react";
import { CallLine, ErrorSummary, Field, Honeypot, RequiredNote, SendError, SubmitButton, SuccessPanel, isEmail, isPhone, useForm } from "./form.jsx";
import { REGIONS, SECTORS } from "../content.js";

const EMPTY = { name: "", phone: "", email: "", org: "", message: "" };

/**
 * Homepage inquiry: "I'm hiring" / "I'm looking for a job" toggle, contact fields,
 * industry + destination, message. Sends to recruit@rsina.in through /api/send.
 */
export default function InquiryForm({ intent, setIntent, industry, setIndustry, region, setRegion }) {
  const employer = intent === "employer";
  const f = useForm({
    form: "home-inquiry",
    prefix: "hi",
    initial: EMPTY,
    validate: (v) => {
      const e = {};
      if (!v.name.trim()) e.name = "Enter your full name.";
      if (!isPhone(v.phone)) e.phone = "Enter a phone number with at least 8 digits.";
      if (!isEmail(v.email)) e.email = "Enter an email address like name@example.com.";
      if (!v.org.trim()) e.org = employer ? "Enter your company name." : "Enter your trade or skill.";
      return e;
    },
    build: (v) => {
      const sector = SECTORS.find((s) => s.id === industry)?.title;
      const destination = REGIONS.find((r) => r.id === region)?.label;
      return {
        subject: employer ? `Manpower requirement — ${sector}` : `Job enquiry — ${sector}`,
        replyTo: v.email,
        fields: [
          ["Enquiry type", employer ? "Employer (hiring)" : "Job seeker"],
          ["Name", v.name],
          ["Phone", v.phone],
          ["Email", v.email],
          [employer ? "Company" : "Trade / skill", v.org],
          ["Industry", sector],
          ["Destination", destination],
          [employer ? "Requirement" : "Message", v.message],
        ],
      };
    },
  });

  // Switching who's asking starts a fresh enquiry
  const { reset } = f;
  useEffect(() => reset(), [intent]); // eslint-disable-line react-hooks/exhaustive-deps

  // Arrow keys move between the two options, as in a native radio group
  const onRadioKey = (e) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
    e.preventDefault();
    const next = employer ? "candidate" : "employer";
    setIntent(next);
    e.currentTarget.querySelector(`[data-id="${next}"]`)?.focus();
  };

  return (
    <div id="inquiry" className="scroll-mt-28 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8">
      <h3 className="font-display text-xl font-semibold text-slate-900">Direct inquiry</h3>
      <p className="mt-1.5 text-sm text-slate-600">Tell us what you need. Our team replies by phone or email.</p>

      <div role="radiogroup" aria-label="I am" onKeyDown={onRadioKey} className="mt-6 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
        {[
          ["employer", "I’m hiring"],
          ["candidate", "I’m looking for a job"],
        ].map(([id, label]) => (
          <button
            key={id}
            data-id={id}
            type="button"
            role="radio"
            aria-checked={intent === id}
            tabIndex={intent === id ? 0 : -1}
            onClick={() => setIntent(id)}
            className={`rounded-lg py-2.5 text-sm font-semibold transition ${
              intent === id ? "bg-white text-slate-900 shadow-sm" : "text-slate-700 hover:text-slate-900"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {f.status === "sent" ? (
        <div className="mt-8">
          <SuccessPanel
            sent={f.sent}
            text="We’ve received your enquiry at recruit@rsina.in and will get back to you shortly."
            action={
              <button type="button" onClick={f.reset} className="mt-6 text-sm font-semibold text-emerald-800 underline-offset-2 hover:underline">
                Write another inquiry
              </button>
            }
          />
        </div>
      ) : (
        <form ref={f.formRef} noValidate onSubmit={f.onSubmit} className="relative mt-6 space-y-4">
          <RequiredNote />
          <ErrorSummary errors={f.errors} id={f.id} />
          <Honeypot inputRef={f.honeypot} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field {...f.field("name")} label="Full name" required autoComplete="name" />
            <Field {...f.field("phone")} label="Phone" required type="tel" autoComplete="tel" inputMode="tel" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field {...f.field("email")} label="Email" required type="email" autoComplete="email" />
            <Field {...f.field("org")} label={employer ? "Company" : "Trade / skill"} required autoComplete={employer ? "organization" : "off"} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field as="select" id="hi-industry" label="Industry" value={industry} onChange={(e) => setIndustry(e.target.value)}>
              {SECTORS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </Field>
            <Field as="select" id="hi-region" label="Destination" value={region} onChange={(e) => setRegion(e.target.value)}>
              {REGIONS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </Field>
          </div>
          <Field
            {...f.field("message")}
            valid={false}
            as="textarea"
            rows={3}
            optional
            label={employer ? "Requirement (headcount, roles, destination)" : "Message"}
          />
          {f.status === "error" && <SendError message={f.message} href={f.fallback()} />}
          <SubmitButton status={f.status} progress={f.progress}>
            {employer ? "Submit requirement" : "Send enquiry"}
            <Send className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </SubmitButton>
          <CallLine />
        </form>
      )}
    </div>
  );
}
