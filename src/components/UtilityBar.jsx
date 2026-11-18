import { Mail, Phone } from "lucide-react";
import { CONTACT } from "../content.js";

/** Slim top contact bar (primary phone + email). Scrolls away; the navbar below stays sticky. */
export default function UtilityBar() {
  const phone = CONTACT.phones[0];
  const email = CONTACT.emails[0];
  return (
    <div className="bg-[#0A0F1D] text-[13px] text-slate-400">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-5 gap-y-1 px-6 py-2.5 sm:justify-end md:px-12">
        <a href={`tel:${phone.replace(/-/g, "")}`} className="flex items-center gap-2 transition-colors hover:text-white">
          <Phone className="size-3.5 text-emerald-400" strokeWidth={1.75} aria-hidden />
          {phone}
        </a>
        <span className="hidden text-slate-700 sm:inline" aria-hidden>
          |
        </span>
        <a href={`mailto:${email}`} className="flex items-center gap-2 transition-colors hover:text-white">
          <Mail className="size-3.5 text-emerald-400" strokeWidth={1.75} aria-hidden />
          {email}
        </a>
      </div>
    </div>
  );
}
