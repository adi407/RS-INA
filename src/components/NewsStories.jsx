import { useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { BadgeCheck, Expand, X } from "lucide-react";
import useDialog from "../useDialog.js";

/** Full-size photo viewer (Esc / backdrop / close button). */
function Lightbox({ image, onClose }) {
  const ref = useDialog(!!image, onClose);
  if (!image) return null;
  return createPortal(
    <div className="fixed inset-0 z-[60] grid place-items-center p-4 sm:p-8">
      <button
        type="button"
        aria-label="Close"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 cursor-zoom-out bg-[#0A0F1D]/85 backdrop-blur-sm motion-safe:animate-[fade-in_0.2s_ease-out]"
      />
      <figure ref={ref} role="dialog" aria-modal="true" aria-label={image.alt} className="relative motion-safe:animate-[fade-up_0.3s_ease-out]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close photo"
          className="absolute -top-12 right-0 grid size-10 place-items-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
        >
          <X className="size-5" />
        </button>
        <img src={image.src} alt={image.alt} className="max-h-[80svh] w-auto max-w-[92vw] rounded-2xl shadow-2xl" />
        <figcaption className="mt-3 text-center text-sm text-slate-300">{image.alt}</figcaption>
      </figure>
    </div>,
    document.body
  );
}

/** Photo that opens in the lightbox. */
function Photo({ image, onOpen, className = "", imgClass = "" }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(image)}
      aria-label={`View larger: ${image.alt}`}
      className={`group/photo block cursor-zoom-in overflow-hidden bg-slate-100 ${className}`}
    >
      <img src={image.src} alt="" loading="lazy" className={`size-full object-cover transition-transform duration-700 ease-out group-hover/photo:scale-105 ${imgClass}`} />
      <span className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-white/80 text-slate-700 opacity-0 shadow backdrop-blur transition-opacity group-hover/photo:opacity-100 group-focus-visible/photo:opacity-100">
        <Expand className="size-4" aria-hidden />
      </span>
    </button>
  );
}

/** One news story: photos (main + inset) beside the text; sides alternate per story. */
function Story({ story, index, onOpen, icon }) {
  const flip = index % 2 === 1;
  const [main, inset] = story.images;
  const Icon = icon || BadgeCheck;
  return (
    <article
      id={story.id}
      data-reveal
      aria-labelledby={`${story.id}-title`}
      className="grid scroll-mt-28 grid-cols-1 items-center gap-10 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-900/5 transition-colors duration-300 hover:border-emerald-500/50 sm:p-8 lg:grid-cols-12 lg:gap-12 lg:p-12"
    >
      {/* Photos */}
      <div className={`relative lg:col-span-6 ${inset ? "pb-8 pr-8 sm:pb-10 sm:pr-10" : ""} ${flip ? "lg:order-2" : ""}`}>
        <Photo image={main} onOpen={onOpen} className="relative h-64 w-full rounded-2xl shadow-md sm:h-80" />
        {inset && (
          <Photo
            image={inset}
            onOpen={onOpen}
            className={`absolute bottom-0 right-0 rounded-2xl shadow-xl ring-4 ring-white ${
              inset.portrait ? "h-40 w-24 sm:h-56 sm:w-32" : "h-24 w-40 sm:h-32 sm:w-56"
            }`}
          />
        )}
      </div>

      {/* Text */}
      <div className={`lg:col-span-6 ${flip ? "lg:order-1" : ""}`}>
        <p className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-700 ring-1 ring-emerald-100">
          <Icon className="size-3.5" aria-hidden />
          {story.label}
        </p>
        <h2 id={`${story.id}-title`} className="mt-5 font-display text-2xl font-bold leading-tight tracking-tight text-slate-900 lg:text-3xl">
          {story.title}
        </h2>
        <p className="mt-5 text-lg font-medium leading-relaxed text-slate-900">{story.lead}</p>
        <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-slate-600">
          {story.body.map((p) => (
            <p key={p.slice(0, 32)}>{p}</p>
          ))}
        </div>
      </div>
    </article>
  );
}

/**
 * News stories as wide alternating bento cards (used by RS Updates and Global Updates).
 * story: { id, label, title, images: [{ src, alt, portrait? }], lead, body: string[] }
 * icons: optional { [story.id]: LucideIcon } for the label pill. Photos open full size.
 */
export default function NewsStories({ stories, icons = {} }) {
  const [photo, setPhoto] = useState(null);
  const close = useCallback(() => setPhoto(null), []);
  return (
    <>
      <div className="mx-auto max-w-7xl space-y-10 lg:space-y-12">
        {stories.map((s, i) => (
          <Story key={s.id} story={s} index={i} onOpen={setPhoto} icon={icons[s.id]} />
        ))}
      </div>
      <Lightbox image={photo} onClose={close} />
    </>
  );
}
