import { useCallback, useRef, useState } from "react";
import { BadgeCheck, Briefcase, Building2, CheckCircle2, FileText, Mail, MapPin, Phone, Send, UploadCloud, X } from "lucide-react";
import { SectionHeader, SlashBreak } from "../components/ui.jsx";
import PageBanner from "../components/PageBanner.jsx";
import MetricsSection from "../components/MetricsSection.jsx";
import { CONTACT, CONTACT_PAGE, LICENSE } from "../content.js";

const SECTION = "scroll-mt-20 px-6 py-16 lg:px-12 lg:py-24";
const TABS = [
  { id: "company", icon: Building2 },
  { id: "jobseeker", icon: Briefcase },
];
const EMPTY = { name: "", phone: "", email: "", purpose: "", message: "" };
const F = CONTACT_PAGE.fields;
const INPUT =
  "w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";

const kb = (n) => (n < 1024 * 1024 ? `${Math.max(1, Math.round(n / 1024))} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`);

/** Drag-and-drop resume picker (PDF / Word). The file itself is attached in the email. */
function ResumeDrop({ file, setFile, error }) {
  const inputRef = useRef(null);
  const [over, setOver] = useState(false);
  const pick = (f) => f && setFile(f);

  if (file) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-emerald-500/40 bg-emerald-50/60 px-4 py-3">
        <FileText className="size-5 shrink-0 text-emerald-600" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">{file.name}</p>
          <p className="text-xs text-slate-500">{kb(file.size)}</p>
        </div>
        <button
          type="button"
          onClick={() => setFile(null)}
          aria-label={`Remove ${file.name}`}
          className="grid size-8 place-items-center rounded-full text-slate-500 transition-colors hover:bg-white hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <X className="size-4" />
        </button>
      </div>
    );
  }
  return (
    <label
      htmlFor="cf-resume"
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        pick(e.dataTransfer.files?.[0]);
      }}
      className={`flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed px-6 py-7 text-center transition-colors focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 ${
        over ? "border-emerald-500 bg-emerald-50" : error ? "border-rose-300 bg-rose-50/40" : "border-slate-200 bg-slate-50 hover:border-emerald-500/60"
      }`}
    >
      <UploadCloud className={`size-7 ${over ? "text-emerald-600" : "text-slate-400"}`} strokeWidth={1.5} aria-hidden />
      <span className="mt-2 text-sm font-semibold text-slate-900">
        Drop your resume here or <span className="text-emerald-600 underline underline-offset-2">browse</span>
      </span>
      <span className="mt-1 text-xs text-slate-500">PDF, DOC or DOCX</span>
      <input
        ref={inputRef}
        id="cf-resume"
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={(e) => pick(e.target.files?.[0])}
        aria-invalid={!!error}
        aria-describedby={error ? "ce-resume" : undefined}
        className="sr-only"
      />
    </label>
  );
}

/**
 * One enquiry form (the old page's fields, labels in English and Hindi).
 * No backend yet: Send opens the visitor's email app with the enquiry filled in,
 * addressed to the agency; a job seeker attaches the chosen resume there.
 */
function EnquiryForm({ kind, hidden }) {
  const seeker = kind === "jobseeker";
  const [form, setForm] = useState(EMPTY);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(null); // resume name (or true) once sent
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const id = (k) => `cf-${kind}-${k}`;

  const submit = (ev) => {
    ev.preventDefault();
    const e = {};
    if (!form.name.trim()) e.name = "Please enter your name.";
    if (!/^[+\d][\d\s-]{7,}$/.test(form.phone.trim())) e.phone = "Enter a valid phone number.";
    if (form.email.trim() && !/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = "Enter a valid email address.";
    if (seeker && !file) e.resume = "Please choose your resume.";
    setErrors(e);
    if (Object.keys(e).length) return;

    const lines = [`Name: ${form.name}`, `Contact No.: ${form.phone}`];
    if (form.email.trim()) lines.push(`Email: ${form.email}`);
    if (form.purpose.trim()) lines.push(`Purpose of contact: ${form.purpose}`);
    if (form.message.trim()) lines.push("", form.message);
    if (seeker) lines.push("", `(Resume attached: ${file.name})`);
    const body = lines.join("\n");
    const subject = `${seeker ? "Job seeker" : "Company"} enquiry${form.purpose ? ` — ${form.purpose}` : ""}`;
    window.location.href = `mailto:${CONTACT.emails[0]}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(seeker ? file.name : true);
    setForm(EMPTY);
    setFile(null);
  };

  const err = (k) =>
    errors[k] && (
      <p id={`ce-${k}`} className="mt-1.5 text-xs text-rose-600">
        {errors[k]}
      </p>
    );
  const field = (k, { required, ...props } = {}) => (
    <div>
      <label htmlFor={id(k)} className="mb-1.5 block text-sm font-medium text-slate-700">
        {F[k]} {required && <span className="text-rose-500">*</span>}
      </label>
      <input
        id={id(k)}
        value={form[k]}
        onChange={set(k)}
        aria-invalid={!!errors[k]}
        aria-describedby={errors[k] ? `ce-${k}` : undefined}
        className={`${INPUT} ${errors[k] ? "border-rose-400" : "border-slate-200"}`}
        {...props}
      />
      {err(k)}
    </div>
  );

  return (
    <div role="tabpanel" id={`panel-${kind}`} aria-labelledby={`tab-${kind}`} hidden={hidden}>
      {sent ? (
        <div role="status" className="flex flex-col items-center px-2 py-12 text-center motion-safe:animate-[fade-up_0.35s_ease-out]">
          <CheckCircle2 className="size-12 text-emerald-600" strokeWidth={1.5} />
          <p className="mt-4 text-lg font-semibold text-slate-900">Your email app should now be open.</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-600">
            {seeker ? (
              <>
                Attach <span className="font-semibold text-slate-900">{sent}</span> to the email and send it to {CONTACT.emails[0]}.
              </>
            ) : (
              <>Send the pre-filled enquiry to {CONTACT.emails[0]}.</>
            )}{" "}
            Or call us on {CONTACT.phones[0]}.
          </p>
          <button
            type="button"
            onClick={() => setSent(null)}
            className="mt-7 text-sm font-semibold text-emerald-600 hover:text-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            Send another enquiry
          </button>
        </div>
      ) : (
        <form noValidate onSubmit={submit} className="space-y-5 motion-safe:animate-[fade-up_0.35s_ease-out]">
          <div className="grid gap-5 sm:grid-cols-2">
            {field("name", { required: true, autoComplete: "name" })}
            {field("phone", { required: true, type: "tel", autoComplete: "tel" })}
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {field("email", { type: "email", autoComplete: "email" })}
            {field("purpose")}
          </div>
          <div>
            <label htmlFor={id("message")} className="mb-1.5 block text-sm font-medium text-slate-700">
              {F.message}
            </label>
            <textarea id={id("message")} rows={4} value={form.message} onChange={set("message")} className={`${INPUT} resize-none border-slate-200`} />
          </div>
          {seeker && (
            <div>
              <p className="mb-1.5 text-sm font-medium text-slate-700">
                {F.resume} <span className="text-rose-500">*</span>
              </p>
              <ResumeDrop file={file} setFile={setFile} error={errors.resume} />
              {err("resume")}
            </div>
          )}
          <button
            type="submit"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-7 py-3.5 font-medium text-white shadow-lg shadow-emerald-950/10 transition-all hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 sm:w-auto"
          >
            {CONTACT_PAGE.submit}
            <Send className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </button>
        </form>
      )}
    </div>
  );
}

/**
 * /contact — "Contact Us": tabbed company / job-seeker enquiry forms beside a direct
 * contact card, the four office countries, then the 2022-2023 figures.
 * ?for=jobseeker opens straight on the job-seeker tab.
 */
export default function ContactPage() {
  const [tab, setTabState] = useState(() => (new URLSearchParams(window.location.search).get("for") === "jobseeker" ? "jobseeker" : "company"));
  const tabRefs = useRef({});
  const setTab = useCallback((t) => {
    setTabState(t);
    const url = new URL(window.location.href);
    if (t === "jobseeker") url.searchParams.set("for", t);
    else url.searchParams.delete("for");
    window.history.replaceState(null, "", url);
  }, []);
  // Arrow keys move between tabs (WAI-ARIA tabs pattern)
  const onKey = (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const next = tab === "company" ? "jobseeker" : "company";
    setTab(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <>
      <PageBanner crumb={CONTACT_PAGE.title} tag={CONTACT_PAGE.tag} title={CONTACT_PAGE.title} image={CONTACT_PAGE.banner} />

      {/* Enquiry forms + direct contact */}
      <section id="enquiry" aria-labelledby="enquiry-title" className={`${SECTION} bg-[#F8FAFC]`}>
        <div className="mx-auto max-w-7xl">
          <SectionHeader id="enquiry-title" tag={CONTACT_PAGE.formsTag} title={CONTACT_PAGE.formsTitle} split={2} align="center" />

          <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-12 lg:gap-8">
            <div data-reveal className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8 lg:col-span-8 lg:p-10">
              <div role="tablist" aria-label="Who is getting in touch" className="mb-8 grid grid-cols-2 gap-1.5 rounded-2xl bg-slate-100 p-1.5" onKeyDown={onKey}>
                {TABS.map(({ id, icon: Icon }) => {
                  const on = tab === id;
                  const t = CONTACT_PAGE.tabs[id];
                  return (
                    <button
                      key={id}
                      ref={(el) => (tabRefs.current[id] = el)}
                      id={`tab-${id}`}
                      type="button"
                      role="tab"
                      aria-selected={on}
                      aria-controls={`panel-${id}`}
                      tabIndex={on ? 0 : -1}
                      onClick={() => setTab(id)}
                      className={`flex items-center justify-center gap-2.5 rounded-xl px-3 py-3 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 sm:justify-start sm:px-4 ${
                        on ? "bg-white text-slate-900 shadow-md shadow-slate-900/5" : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      <span
                        className={`hidden size-9 shrink-0 place-items-center rounded-lg transition-colors sm:grid ${
                          on ? "bg-emerald-600 text-white" : "bg-white text-slate-400"
                        }`}
                      >
                        <Icon className="size-[18px]" strokeWidth={1.75} aria-hidden />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold sm:text-[15px]">{t.label}</span>
                        <span className="hidden truncate text-xs font-normal text-slate-500 sm:block">{t.hint}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
              {/* Both forms stay mounted so switching tabs keeps what was typed */}
              {TABS.map(({ id }) => (
                <EnquiryForm key={id} kind={id} hidden={tab !== id} />
              ))}
            </div>

            {/* Direct contact */}
            <aside
              data-reveal
              style={{ "--d": "120ms" }}
              aria-labelledby="inquiry-title"
              className="relative flex flex-col overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 text-white shadow-2xl lg:col-span-4 lg:p-10"
            >
              <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-emerald-500/15 blur-3xl" />
              <h2 id="inquiry-title" className="relative font-display text-2xl font-bold tracking-tight">
                {CONTACT_PAGE.inquiryTitle}
              </h2>
              <ul className="relative mt-8 space-y-4">
                {CONTACT.phones.map((p) => (
                  <li key={p}>
                    <a href={`tel:${p.replace(/[^\d+]/g, "")}`} className="group flex items-center gap-4 rounded-2xl p-2 -m-2 transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400">
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
                        <Phone className="size-5" strokeWidth={1.5} aria-hidden />
                      </span>
                      <span>
                        <span className="block text-xs uppercase tracking-widest text-slate-400">Call us</span>
                        <span className="font-semibold text-white group-hover:text-emerald-300">{p}</span>
                      </span>
                    </a>
                  </li>
                ))}
                {CONTACT.emails.map((m) => (
                  <li key={m}>
                    <a href={`mailto:${m}`} className="group flex items-center gap-4 rounded-2xl p-2 -m-2 transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400">
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
                        <Mail className="size-5" strokeWidth={1.5} aria-hidden />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs uppercase tracking-widest text-slate-400">Email us</span>
                        <span className="block truncate font-semibold text-white group-hover:text-emerald-300">{m}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
              <div className="relative mt-10 border-t border-white/10 pt-6 lg:mt-auto">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-400">
                  <BadgeCheck className="size-4" aria-hidden />
                  Govt. of India Approved
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  License No: <SlashBreak text={LICENSE} />
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Offices */}
      <section id="offices" aria-labelledby="offices-title" className={`${SECTION} bg-white`}>
        <div className="mx-auto max-w-7xl">
          <SectionHeader id="offices-title" tag={CONTACT_PAGE.officesTag} title={CONTACT_PAGE.officesTitle} split={1} align="center" />
          <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {CONTACT_PAGE.offices.map((o, i) => (
              <li
                key={o.code}
                data-reveal
                style={{ "--d": `${i * 90}ms` }}
                className="group flex flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-lg shadow-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display text-lg font-bold text-slate-900">{o.country}</h3>
                  <span className="rounded-md bg-slate-900 px-2 py-1 font-display text-xs font-bold tracking-widest text-white transition-colors group-hover:bg-emerald-600" aria-hidden>
                    {o.code}
                  </span>
                </div>
                <div className="mt-5 space-y-5 border-t border-slate-100 pt-5">
                  {o.places.map((pl) => (
                    <address key={pl.address} className="flex gap-3 not-italic">
                      <MapPin className="mt-0.5 size-4 shrink-0 text-emerald-600" strokeWidth={1.75} aria-hidden />
                      <span className="text-sm leading-relaxed text-slate-600">
                        {pl.name && <span className="block font-semibold text-slate-900">{pl.name}</span>}
                        {pl.address}
                      </span>
                    </address>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <MetricsSection className="bg-[#F8FAFC]" />
    </>
  );
}
