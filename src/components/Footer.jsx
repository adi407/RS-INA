import { useState } from "react";
import { Facebook, Instagram, Linkedin, Mail, Phone } from "lucide-react";
import Logo from "./Logo.jsx";
import { ABOUT, CONTACT, FOOTER } from "../content.js";
import { linkTo } from "../routes.js";

const SOCIAL_ICONS = { Facebook, Instagram, LinkedIn: Linkedin };

/** Column heading + link list; links nudge right on hover. */
function LinkColumn({ title, links, onIntent, className = "" }) {
  return (
    <nav aria-label={title} className={className}>
      <h2 className="font-display text-base font-bold text-white">{title}</h2>
      <ul className="mt-4 space-y-1">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={linkTo(l.href)}
              onClick={() => l.intent && onIntent(l.intent)}
              className="inline-flex min-h-11 items-center text-[15px] text-slate-300 transition-all duration-300 hover:translate-x-1 hover:text-emerald-300"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** "Reduce motion" switch: remembered per visitor, on top of the OS setting. Reloads so every effect picks it up. */
function MotionSwitch() {
  const [reduced, setReduced] = useState(() => document.documentElement.dataset.motion === "reduce");
  const toggle = () => {
    const next = !reduced;
    setReduced(next);
    try {
      if (next) localStorage.setItem("rs-motion", "reduce");
      else localStorage.removeItem("rs-motion");
    } catch {
      /* storage blocked: applies to this visit only */
    }
    if (next) document.documentElement.dataset.motion = "reduce";
    else delete document.documentElement.dataset.motion;
    window.location.reload();
  };
  return (
    <button type="button" role="switch" aria-checked={reduced} onClick={toggle} className="inline-flex min-h-11 items-center gap-3 text-sm text-slate-300 hover:text-white">
      <span className={`relative h-6 w-10 rounded-full transition-colors ${reduced ? "bg-emerald-600" : "bg-slate-700"}`} aria-hidden>
        <span className={`absolute top-1 size-4 rounded-full bg-white transition-transform ${reduced ? "translate-x-5" : "translate-x-1"}`} />
      </span>
      Reduce motion
    </button>
  );
}

export default function Footer({ onIntent }) {
  return (
    <footer
      // Footer reveal: sticks to the bottom under the raised <main> on large, tall screens only
      className="z-0 border-t border-slate-800/80 bg-[#0A0F1D] px-6 pb-28 pt-20 text-slate-300 md:px-12 md:pb-20 [@media(min-width:1024px)_and_(min-height:760px)]:sticky [@media(min-width:1024px)_and_(min-height:760px)]:bottom-0"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <Logo />
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-slate-300">{ABOUT.blurb}</p>
          <ul className="mt-8 flex gap-3" aria-label="Social media">
            {FOOTER.social.map(({ label, href }) => {
              const Icon = SOCIAL_ICONS[label];
              return (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} (opens in a new tab)`}
                    className="grid size-11 place-items-center rounded-xl border border-slate-700 bg-slate-900 text-slate-200 transition-all duration-300 hover:border-emerald-600 hover:bg-emerald-700 hover:text-white"
                  >
                    <Icon className="size-[18px]" strokeWidth={1.7} aria-hidden />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <LinkColumn title="Quick Links" links={FOOTER.quickLinks} onIntent={onIntent} className="lg:col-span-2" />
        <LinkColumn title="Company" links={FOOTER.companyLinks} onIntent={onIntent} className="lg:col-span-2" />

        <div className="lg:col-span-4">
          <h2 className="font-display text-base font-bold text-white">Get In Touch</h2>
          <ul className="mt-4 space-y-1 text-[15px]">
            {CONTACT.phones.map((p) => (
              <li key={p}>
                <a href={`tel:${p.replace(/[^\d+]/g, "")}`} className="group flex min-h-11 items-center gap-3 text-slate-300 transition-colors hover:text-emerald-300">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-slate-700 bg-slate-900 transition-colors group-hover:border-emerald-600/60">
                    <Phone className="size-3.5 text-emerald-400" strokeWidth={1.8} aria-hidden />
                  </span>
                  {p}
                </a>
              </li>
            ))}
            {CONTACT.emails.map((e) => (
              <li key={e}>
                <a href={`mailto:${e}`} className="group flex min-h-11 items-center gap-3 text-slate-300 transition-colors hover:text-emerald-300">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-slate-700 bg-slate-900 transition-colors group-hover:border-emerald-600/60">
                    <Mail className="size-3.5 text-emerald-400" strokeWidth={1.8} aria-hidden />
                  </span>
                  <span className="min-w-0 [overflow-wrap:anywhere]">{e}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-7xl flex-col gap-3 border-t border-slate-800/80 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <p>{FOOTER.copyright}</p>
        <MotionSwitch />
        <p>{FOOTER.credit}</p>
      </div>
    </footer>
  );
}
