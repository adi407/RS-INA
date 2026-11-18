import { useEffect, useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { BTN_PRIMARY } from "./ui.jsx";
import { CONTACT, REGIONS, SECTORS } from "../content.js";

const EMPTY = { name: "", phone: "", email: "", org: "", message: "" };

/**
 * Direct inquiry form with Employer / Candidate intent.
 * No backend yet: on submit it opens the visitor's email app with a pre-filled
 * message to the agency inbox. Swap `submit()` for an API call when one exists.
 * `region` (from the hero search) is included in the message when set.
 */
export default function InquiryForm({ intent, setIntent, industry, setIndustry, region, setRegion }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  // A new intent (from a link, CTA or sector card) resets the success state
  useEffect(() => setSent(false), [intent, industry]);

  const employer = intent === "employer";
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Please enter your name.";
    if (!/^[+\d][\d\s-]{7,}$/.test(form.phone.trim())) e.phone = "Enter a valid phone number.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = "Enter a valid email address.";
    if (!form.org.trim()) e.org = employer ? "Please enter your company." : "Please enter your trade or skill.";
    return e;
  };

  const submit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    const sector = SECTORS.find((s) => s.id === industry)?.title;
    const destination = REGIONS.find((r) => r.id === region)?.label;
    const subject = employer ? `Manpower requirement — ${sector}` : `Job application — ${sector}`;
    const body = [
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Email: ${form.email}`,
      `${employer ? "Company" : "Trade / skill"}: ${form.org}`,
      `Industry: ${sector}`,
      destination && `Destination: ${destination}`,
      "",
      form.message,
    ]
      .filter((l) => l !== undefined && l !== false)
      .join("\n");
    window.location.href = `mailto:${CONTACT.emails[0]}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
    setForm(EMPTY);
  };

  const input =
    "w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15";
  const field = (k, label, props = {}) => (
    <div>
      <label htmlFor={`f-${k}`} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={`f-${k}`}
        value={form[k]}
        onChange={set(k)}
        aria-invalid={!!errors[k]}
        aria-describedby={errors[k] ? `e-${k}` : undefined}
        className={`${input} ${errors[k] ? "border-rose-400" : "border-slate-300"}`}
        {...props}
      />
      {errors[k] && (
        <p id={`e-${k}`} className="mt-1.5 text-xs text-rose-600">
          {errors[k]}
        </p>
      )}
    </div>
  );

  return (
    <div id="inquiry" className="scroll-mt-28 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8">
      <h3 className="font-display text-xl font-semibold text-slate-900">Direct inquiry</h3>
      <p className="mt-1.5 text-sm text-slate-500">Tell us what you need — our team will get back to you.</p>

      {/* Intent toggle */}
      <div role="radiogroup" aria-label="I am" className="mt-6 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
        {[
          ["employer", "I’m hiring"],
          ["candidate", "I’m looking for a job"],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={intent === id}
            onClick={() => setIntent(id)}
            className={`rounded-lg py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
              intent === id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {sent ? (
        <div role="status" className="mt-8 flex flex-col items-center rounded-2xl bg-emerald-50 px-6 py-10 text-center">
          <CheckCircle2 className="size-10 text-emerald-600" strokeWidth={1.5} />
          <p className="mt-4 font-semibold text-slate-900">Your email app should now be open.</p>
          <p className="mt-1.5 max-w-xs text-sm text-slate-600">
            Send the pre-filled message to {CONTACT.emails[0]}, or call {CONTACT.phones[0]}.
          </p>
          <button type="button" onClick={() => setSent(false)} className="mt-5 text-sm font-semibold text-emerald-700 hover:text-emerald-600">
            Write another inquiry
          </button>
        </div>
      ) : (
        <form noValidate onSubmit={submit} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {field("name", "Full name", { autoComplete: "name" })}
            {field("phone", "Phone", { type: "tel", autoComplete: "tel" })}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {field("email", "Email", { type: "email", autoComplete: "email" })}
            {field("org", employer ? "Company" : "Trade / skill", { autoComplete: employer ? "organization" : "off" })}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="f-industry" className="mb-1.5 block text-sm font-medium text-slate-700">
              Industry
            </label>
            <select
              id="f-industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className={`${input} cursor-pointer border-slate-300`}
            >
              {SECTORS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>
          {/* Destination (moved here from the old hero search bar) */}
          <div>
            <label htmlFor="f-region" className="mb-1.5 block text-sm font-medium text-slate-700">
              Destination
            </label>
            <select
              id="f-region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className={`${input} cursor-pointer border-slate-300`}
            >
              {REGIONS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          </div>
          <div>
            <label htmlFor="f-message" className="mb-1.5 block text-sm font-medium text-slate-700">
              {employer ? "Requirement (headcount, roles, destination)" : "Message"}
            </label>
            <textarea id="f-message" rows={3} value={form.message} onChange={set("message")} className={`${input} resize-none border-slate-300`} />
          </div>
          <button type="submit" className={`${BTN_PRIMARY} w-full`}>
            {employer ? "Submit requirement" : "Send application"}
            <Send className="size-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </form>
      )}
    </div>
  );
}
