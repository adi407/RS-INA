import { useCallback, useRef, useState } from "react";
import { BadgeCheck, Briefcase, Building2, ExternalLink, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { SectionHeader, SlashBreak } from "../components/ui.jsx";
import PageBanner from "../components/PageBanner.jsx";
import { CallLine, ErrorSummary, Field, Honeypot, RequiredNote, ResumeField, SendError, SubmitButton, SuccessPanel, checkResume, isEmail, isPhone, useForm } from "../components/form.jsx";
import { CONTACT, CONTACT_PAGE, LICENSE } from "../content.js";

const SECTION = "scroll-mt-20 px-6 py-16 lg:px-12 lg:py-24";
const TABS = [
  { id: "company", icon: Building2 },
  { id: "jobseeker", icon: Briefcase },
];
const EMPTY = { name: "", phone: "", email: "", purpose: "", message: "", resume: null };
const F = CONTACT_PAGE.fields;
const tel = (p) => `tel:${p.replace(/[^\d+]/g, "")}`;
const mapUrl = (address) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

/** One enquiry form; both stay mounted (one hidden) so switching tabs keeps what was typed. */
function EnquiryForm({ kind, hidden }) {
  const seeker = kind === "jobseeker";
  const f = useForm({
    form: seeker ? "contact-jobseeker" : "contact-company",
    prefix: `cf-${kind}`,
    initial: EMPTY,
    validate: (v) => {
      const e = {};
      if (!v.name.trim()) e.name = "Enter your name.";
      if (!isPhone(v.phone)) e.phone = "Enter a phone number with at least 8 digits.";
      if (v.email.trim() && !isEmail(v.email)) e.email = "Enter an email address like name@example.com, or leave it empty.";
      if (seeker) {
        const r = checkResume(v.resume);
        if (r) e.resume = r;
      }
      return e;
    },
    build: (v) => ({
      subject: `${seeker ? "Job seeker" : "Company"} enquiry${v.purpose.trim() ? ` — ${v.purpose.trim()}` : ""}`,
      replyTo: v.email,
      file: seeker ? v.resume : undefined,
      fields: [
        ["Enquiry from", seeker ? "Job seeker" : "Company"],
        ["Name", v.name],
        ["Phone", v.phone],
        ["Email", v.email],
        ["Purpose of contact", v.purpose],
        ["Message", v.message],
        ...(seeker ? [["Résumé", v.resume?.name]] : []),
      ],
    }),
  });

  return (
    <div role="tabpanel" id={`panel-${kind}`} aria-labelledby={`tab-${kind}`} hidden={hidden}>
      {f.status === "sent" ? (
        <SuccessPanel
          text={seeker ? "We’ve received your details and résumé. Our team will call or email you." : "We’ve received your enquiry. Our team will call or email you."}
          sent={f.sent}
          action={
            <button type="button" onClick={f.reset} className="mt-6 text-sm font-semibold text-emerald-800 underline-offset-2 hover:underline">
              Send another enquiry
            </button>
          }
        />
      ) : (
        <form ref={f.formRef} noValidate onSubmit={f.onSubmit} className="relative space-y-5">
          <RequiredNote />
          <ErrorSummary errors={f.errors} id={f.id} />
          <Honeypot inputRef={f.honeypot} />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field {...f.field("name")} label={F.name} required autoComplete="name" />
            <Field {...f.field("phone")} label={F.phone} required type="tel" autoComplete="tel" inputMode="tel" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field {...f.field("email")} label={F.email} optional type="email" autoComplete="email" hint="So we can reply in writing." />
            <Field {...f.field("purpose")} valid={false} label={F.purpose} optional />
          </div>
          <Field {...f.field("message")} valid={false} as="textarea" rows={4} label={F.message} optional />
          {seeker && (
            <ResumeField
              id={f.id("resume")}
              label={F.resume}
              file={f.values.resume}
              onFile={(file) => f.setValue("resume", file)}
              error={f.errors.resume}
              shake={f.field("resume").shake}
              sending={f.status === "sending"}
              progress={f.progress}
            />
          )}
          <p className="text-sm text-slate-600">
            By sending this form you agree to our{" "}
            <a href="/privacy" className="font-semibold text-emerald-800 underline underline-offset-2">
              privacy policy
            </a>
            .
          </p>
          {f.status === "error" && <SendError message={f.message} href={f.fallback()} />}
          <SubmitButton status={f.status} progress={f.progress} className="sm:w-auto">
            {CONTACT_PAGE.submit}
            <Send className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </SubmitButton>
        </form>
      )}
    </div>
  );
}

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
  const onKey = (e) => {
    const ids = TABS.map((t) => t.id);
    const map = { ArrowRight: 1, ArrowLeft: -1, Home: "first", End: "last" };
    if (!(e.key in map)) return;
    e.preventDefault();
    const i = ids.indexOf(tab);
    const next = map[e.key] === "first" ? ids[0] : map[e.key] === "last" ? ids[ids.length - 1] : ids[(i + map[e.key] + ids.length) % ids.length];
    setTab(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <>
      <PageBanner crumb={CONTACT_PAGE.title} tag={CONTACT_PAGE.tag} title={CONTACT_PAGE.title} image={CONTACT_PAGE.banner} />

      <section id="enquiry" aria-labelledby="enquiry-title" className={`${SECTION} bg-[#F8FAFC]`}>
        <div className="mx-auto max-w-7xl">
          <SectionHeader id="enquiry-title" tag={CONTACT_PAGE.formsTag} title={CONTACT_PAGE.formsTitle} split={2} align="center" />

          <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-12 lg:gap-8">
            <div data-reveal className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8 lg:col-span-8 lg:p-10">
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
                      className={`flex items-center justify-center gap-2.5 rounded-xl px-3 py-3 text-left transition-all duration-300 sm:justify-start sm:px-4 ${
                        on ? "bg-white text-slate-900 shadow-md shadow-slate-900/5" : "text-slate-700 hover:text-slate-900"
                      }`}
                    >
                      <span className={`hidden size-9 shrink-0 place-items-center rounded-lg transition-colors sm:grid ${on ? "bg-emerald-700 text-white" : "bg-white text-slate-600"}`}>
                        <Icon className="size-[18px]" strokeWidth={1.75} aria-hidden />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold sm:text-[15px]">{t.label}</span>
                        <span className={`hidden truncate text-xs font-normal sm:block ${on ? "text-slate-600" : "text-slate-700"}`}>{t.hint}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
              {TABS.map(({ id }) => (
                <EnquiryForm key={id} kind={id} hidden={tab !== id} />
              ))}
            </div>

            {/* Direct contact (a plain region, not a nested <aside> landmark) */}
            <div
              data-reveal
              style={{ "--d": "120ms" }}
              role="region"
              aria-labelledby="direct-title"
              className="relative flex flex-col overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 text-white shadow-2xl lg:col-span-4 lg:p-10"
            >
              <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-emerald-500/15 blur-3xl" />
              <h2 id="direct-title" className="relative font-display text-2xl font-bold tracking-tight">
                {CONTACT_PAGE.inquiryTitle}
              </h2>
              <ul className="relative mt-8 space-y-4">
                {CONTACT.phones.map((p) => (
                  <li key={p}>
                    <a href={tel(p)} className="group -m-2 flex min-h-11 items-center gap-4 rounded-2xl p-2 transition-colors hover:bg-white/5">
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
                <li>
                  <a
                    href={`https://wa.me/${CONTACT.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group -m-2 flex min-h-11 items-center gap-4 rounded-2xl p-2 transition-colors hover:bg-white/5"
                  >
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
                      <MessageCircle className="size-5" strokeWidth={1.5} aria-hidden />
                    </span>
                    <span>
                      <span className="block text-xs uppercase tracking-widest text-slate-400">WhatsApp</span>
                      <span className="font-semibold text-white group-hover:text-emerald-300">Chat with us</span>
                      <span className="sr-only"> (opens WhatsApp in a new tab)</span>
                    </span>
                  </a>
                </li>
                {CONTACT.emails.map((m) => (
                  <li key={m}>
                    <a href={`mailto:${m}`} className="group -m-2 flex min-h-11 items-center gap-4 rounded-2xl p-2 transition-colors hover:bg-white/5">
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
            </div>
          </div>
          <div className="mt-8">
            <CallLine />
          </div>
        </div>
      </section>

      <section id="offices" aria-labelledby="offices-title" className={`${SECTION} bg-white`}>
        <div className="mx-auto max-w-7xl">
          <SectionHeader id="offices-title" tag={CONTACT_PAGE.officesTag} title={CONTACT_PAGE.officesTitle} split={1} align="center" />
          <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {CONTACT_PAGE.offices.map((o, i) => (
              <li
                key={o.code}
                data-reveal
                style={{ "--d": `${i * 90}ms` }}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-600/50"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display text-lg font-bold text-slate-900">{o.country}</h3>
                  <span className="rounded-md bg-slate-900 px-2 py-1 font-display text-xs font-bold tracking-widest text-white transition-colors group-hover:bg-emerald-700" aria-hidden>
                    {o.code}
                  </span>
                </div>
                <div className="mt-5 space-y-5 border-t border-slate-100 pt-5">
                  {o.places.map((pl) => (
                    <div key={pl.address}>
                      <address className="flex gap-3 not-italic">
                        <MapPin className="mt-0.5 size-4 shrink-0 text-emerald-700" strokeWidth={1.75} aria-hidden />
                        <span className="text-sm leading-relaxed text-slate-700">
                          {pl.name && <span className="block font-semibold text-slate-900">{pl.name}</span>}
                          {pl.address}
                        </span>
                      </address>
                      <a
                        href={mapUrl(`${pl.name ? pl.name + ", " : ""}${pl.address}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-7 mt-2 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-emerald-800 underline-offset-2 hover:underline"
                      >
                        Open in Google Maps
                        <ExternalLink className="size-3.5" aria-hidden />
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
