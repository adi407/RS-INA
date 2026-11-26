import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, MapPin, X } from "lucide-react";
import useDialog from "../useDialog.js";
import { BTN_PRIMARY } from "./ui.jsx";

/**
 * "Read More" reader shared by the Clients (case studies) and Regions pages: the full
 * original post in a centred dialog with its photo on top, optional place chips, and
 * links to the next story and to the contact form.
 *
 * item: { id, title | client, image, body: (string | { h })[], places? }
 */
export default function StoryReader({ item, list, tag, onClose, onOpen }) {
  const open = !!item;
  const ref = useDialog(open, onClose);
  const heading = useRef(null);
  // "Next" swaps the content in place: start the reader at the top, on the new title
  const id = item?.id;
  const first = useRef(true);
  useEffect(() => {
    if (!id) return;
    if (first.current) {
      first.current = false;
      return;
    }
    ref.current?.scrollTo({ top: 0 });
    heading.current?.focus();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!open) first.current = true;
  }, [open]);
  if (!open) return null;

  const title = item.title ?? item.client;
  const next = list[(list.findIndex((c) => c.id === item.id) + 1) % list.length];

  // Portal to <body>: inside <main> (its own stacking layer) the sticky navbar would sit on top
  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-[#0A0F1D]/60 backdrop-blur-sm motion-safe:animate-[fade-in_0.25s_ease-out]"
      />
      <article
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="story-title"
        data-lenis-prevent
        className="relative max-h-[92svh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl shadow-black/40 sm:rounded-3xl motion-safe:animate-[fade-up_0.35s_ease-out]"
      >
        <div className="relative h-56 overflow-hidden bg-slate-100 sm:h-72">
          <img src={item.image} alt="" className="size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1D]/90 via-[#0A0F1D]/30 to-transparent" />
          <div className="absolute inset-x-6 bottom-5 text-white sm:inset-x-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-300">{tag}</p>
            <h2 id="story-title" ref={heading} tabIndex={-1} className="outline-none mt-1.5 font-display text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/25"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-8 text-[15px] leading-relaxed text-slate-600 sm:px-10 sm:text-base">
          {item.places?.length > 0 && (
            <ul aria-label="Places" className="!mb-6 flex flex-wrap gap-2">
              {item.places.map((p) => (
                <li key={p} className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <MapPin className="size-3.5" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
          )}
          {item.body.map((p) =>
            typeof p === "string" ? (
              <p key={p.slice(0, 32)}>{p}</p>
            ) : (
              <h3 key={p.h} className="!mt-8 font-display text-lg font-bold text-slate-900">
                {p.h}
              </h3>
            )
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <button
            type="button"
            onClick={() => onOpen(next.id)}
            className="group inline-flex items-center gap-2 text-left text-sm font-semibold text-slate-700 transition-colors hover:text-emerald-900"
          >
            <span className="text-slate-600">Next:</span> {next.title ?? next.client}
            <ArrowRight className="size-4 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden />
          </button>
          <a
            href="/contact"
            className={BTN_PRIMARY}
          >
            Hire with R.S. International
          </a>
        </div>
      </article>
    </div>,
    document.body
  );
}
