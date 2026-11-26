import { MessageCircle, Phone } from "lucide-react";
import { CONTACT } from "../content.js";

/** Phones only: a bar pinned to the bottom with Call and WhatsApp, always one tap away. */
export default function MobileActionBar() {
  return (
    <div
      role="region"
      aria-label="Call or message us"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-slate-200 bg-white/95 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_-12px_rgba(15,23,42,0.25)] backdrop-blur md:hidden"
    >
      <a
        href={`tel:${CONTACT.phones[0].replace(/[^\d+]/g, "")}`}
        className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-slate-900 font-semibold text-white active:scale-[0.98]"
      >
        <Phone className="size-4" aria-hidden />
        Call us
      </a>
      <a
        href={`https://wa.me/${CONTACT.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-emerald-700 font-semibold text-white active:scale-[0.98]"
      >
        <MessageCircle className="size-4" aria-hidden />
        WhatsApp
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </div>
  );
}
