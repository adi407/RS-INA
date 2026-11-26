import { Mail, Phone } from "lucide-react";
import { CONTACT } from "../content.js";

/** Slim top contact bar (primary phone + email). Scrolls away; the navbar below stays sticky. */
export default function UtilityBar() {
  const phone = CONTACT.phones[0];
  const email = CONTACT.emails[0];
  return (
    <div role="region" aria-label="Quick contact" className="bg-[#0A0F1D] text-sm text-slate-300">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-5 px-6 sm:justify-end md:px-12">
        <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="flex min-h-10 items-center gap-2 transition-colors hover:text-white">
          <Phone className="size-3.5 text-emerald-400" strokeWidth={1.75} aria-hidden />
          {phone}
        </a>
        <span className="hidden text-slate-600 sm:inline" aria-hidden>
          |
        </span>
        <a href={`mailto:${email}`} className="flex min-h-10 items-center gap-2 transition-colors hover:text-white">
          <Mail className="size-3.5 text-emerald-400" strokeWidth={1.75} aria-hidden />
          {email}
        </a>
      </div>
    </div>
  );
}
