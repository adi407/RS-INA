import { Facebook, Instagram, Linkedin, Mail, Phone } from "lucide-react";
import Logo from "./Logo.jsx";
import { ABOUT, CONTACT, FOOTER } from "../content.js";

const SOCIAL_ICONS = { Facebook, Instagram, LinkedIn: Linkedin };

/** Column heading + link list; links nudge right on hover. */
function LinkColumn({ title, links, onIntent, className = "" }) {
  return (
    <nav aria-label={title} className={className}>
      <h3 className="font-display text-base font-bold text-white">{title}</h3>
      <ul className="mt-6 space-y-3.5">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              onClick={() => l.intent && onIntent(l.intent)}
              className="inline-block text-[15px] text-slate-400 transition-all duration-300 hover:translate-x-1 hover:text-emerald-400 focus-visible:text-emerald-400 focus-visible:outline-none"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Footer({ onIntent }) {
  return (
    <footer className="border-t border-slate-800/80 bg-[#0A0F1D] px-6 py-20 text-slate-300 md:px-12">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
        {/* Column 1 — brand */}
        <div className="lg:col-span-4">
          <Logo />
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-slate-400">{ABOUT.blurb}</p>
          <ul className="mt-8 flex gap-3" aria-label="Social media">
            {FOOTER.social.map(({ label, href }) => {
              const Icon = SOCIAL_ICONS[label];
              return (
                <li key={label}>
                  <a
                    href={href || "#"}
                    aria-label={label}
                    {...(href ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="grid place-items-center rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-slate-300 transition-all duration-300 hover:border-emerald-600 hover:bg-emerald-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                  >
                    <Icon className="size-[18px]" strokeWidth={1.7} aria-hidden />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Columns 2 & 3 — links */}
        <LinkColumn title="Quick Links" links={FOOTER.quickLinks} onIntent={onIntent} className="lg:col-span-2" />
        <LinkColumn title="Company" links={FOOTER.companyLinks} onIntent={onIntent} className="lg:col-span-2" />

        {/* Column 4 — contact */}
        <div className="lg:col-span-4">
          <h3 className="font-display text-base font-bold text-white">Get In Touch</h3>
          <ul className="mt-6 space-y-3.5 text-[15px]">
            {CONTACT.phones.map((p) => (
              <li key={p}>
                <a
                  href={`tel:${p.replace(/-/g, "")}`}
                  className="group flex items-center gap-3 text-slate-400 transition-colors hover:text-emerald-400"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-slate-800 bg-slate-900 transition-colors group-hover:border-emerald-600/60">
                    <Phone className="size-3.5 text-emerald-400" strokeWidth={1.8} aria-hidden />
                  </span>
                  {p}
                </a>
              </li>
            ))}
            {CONTACT.emails.map((e) => (
              <li key={e}>
                <a
                  href={`mailto:${e}`}
                  className="group flex items-center gap-3 text-slate-400 transition-colors hover:text-emerald-400"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-slate-800 bg-slate-900 transition-colors group-hover:border-emerald-600/60">
                    <Mail className="size-3.5 text-emerald-400" strokeWidth={1.8} aria-hidden />
                  </span>
                  <span className="min-w-0 [overflow-wrap:anywhere]">{e}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sub-footer */}
      <div className="mx-auto mt-16 flex max-w-7xl flex-col gap-3 border-t border-slate-800/80 pt-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>{FOOTER.copyright}</p>
        <p>{FOOTER.credit}</p>
      </div>
    </footer>
  );
}
