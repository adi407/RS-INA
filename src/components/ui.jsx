import { Fragment, forwardRef, useRef } from "react";
import { useBlurReveal } from "../motion.js";

/**
 * Design system — RemotePeople-inspired tokens shared by every light section.
 * Canvas: white / slate-50 · Anchors: #0A0F1D (hero, footer) · Text: slate-900 / 600 / 500
 * Accent: emerald-600 actions, emerald-50/700 verification badges.
 */

export const BTN_PRIMARY =
  "group inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-7 py-3.5 font-medium text-white shadow-lg shadow-emerald-950/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2";

export const BTN_GHOST =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-6 py-3.5 font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500";

/** Bento module card */
export const CARD =
  "rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-900/5 transition-all duration-300 hover:border-emerald-500/40";

/** Emerald icon tile used across cards */
export const ICON_TILE =
  "grid size-12 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-100";

/** Section wrapper: alternating canvas + consistent rhythm */
/** Page section. `bg` overrides the white / slate-50 background; extra props (ref, data-*) pass through. */
export const Section = forwardRef(function Section({ id, tint = false, bg, labelledBy, className = "", children, ...rest }, ref) {
  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={labelledBy}
      className={`scroll-mt-20 px-6 py-24 md:px-12 ${bg ?? (tint ? "wash-tint" : "wash-white")} ${className}`}
      {...rest}
    >
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
});

/** Overline tag + H2 (+ optional subtitle). `align="center"` for centred headers. */
/**
 * Two-tone heading text: the first `split` words in slate-900, the rest in slate-500,
 * closed with a decorative emerald dot (replacing any trailing full stop).
 * Words are unchanged; only colour differs. slate-500 keeps WCAG contrast on white/slate-50.
 */
/**
 * Splits text into word spans tagged [data-bw] for the word-by-word blur reveal
 * (useBlurReveal). Plain inline spans, so underlines and wrapping behave as normal text.
 */
export function Words({ text }) {
  const words = String(text).split(" ");
  return words.map((w, i) => (
    <Fragment key={i}>
      <span data-bw>{w}</span>
      {i < words.length - 1 ? " " : ""}
    </Fragment>
  ));
}

export function TwoTone({ text, split }) {
  if (!split) return <Words text={text} />;
  const words = text.replace(/\.$/, "").split(" ");
  const rest = words.slice(split);
  const last = rest.pop();
  return (
    <>
      <Words text={words.slice(0, split).join(" ")} />{" "}
      <span className="text-slate-500 transition-colors duration-700 group-data-[dark=true]/theme:text-slate-400">
        {rest.length > 0 && (
          <>
            <Words text={rest.join(" ")} />{" "}
          </>
        )}
        {/* nowrap keeps the dot on the same line as the final word */}
        <span className="whitespace-nowrap">
          <span data-bw>{last}</span>
          <span data-bw aria-hidden className="ml-[0.06em] inline-block size-[0.17em] rounded-full bg-emerald-500" />
        </span>
      </span>
    </>
  );
}

export function SectionHeader({ id, tag, title, split, subtitle, align = "left", className = "" }) {
  const center = align === "center";
  const ref = useRef(null);
  useBlurReveal(ref);
  return (
    <header ref={ref} className={`${center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"} ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 transition-colors duration-700 group-data-[dark=true]/theme:text-emerald-400">
        <Words text={tag} />
      </p>
      <h2 id={id} className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 transition-colors duration-700 group-data-[dark=true]/theme:text-white lg:text-4xl">
        <TwoTone text={title} split={split} />
      </h2>
      {subtitle && (
        <p className={`mt-4 text-base leading-relaxed text-slate-600 ${center ? "mx-auto max-w-xl" : "max-w-xl"}`}>
          <Words text={subtitle} />
        </p>
      )}
    </header>
  );
}

/**
 * Faint architectural line pattern (diagonals + verticals, from the design's Frame.svg)
 * used behind big headings, nk.studio-style. Fades out toward its edges.
 * Position it with `className` (it's absolute, behind content: parent needs `relative isolate`).
 */
export function LinePattern({ className = "" }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute -z-10 bg-[url(/media/grid-lines.svg)] bg-[length:1440px_520px] bg-center bg-no-repeat [mask-image:radial-gradient(ellipse_65%_70%_at_50%_50%,black_30%,transparent_100%)] ${className}`}
    />
  );
}

/** Wraps a block of text so its [data-bw] words get the scroll blur reveal. */
export function BlurGroup({ as: Tag = "div", className, children, ...rest }) {
  const ref = useRef(null);
  useBlurReveal(ref);
  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}

/** A long slash-separated code (the MEA licence no.) that may wrap only after a slash, never inside "B-0605". */
export function SlashBreak({ text }) {
  const parts = text.split("/");
  return parts.map((part, i) => (
    <span key={i} className="whitespace-nowrap">
      {part}
      {i < parts.length - 1 && "/"}
      {i < parts.length - 1 && <wbr />}
    </span>
  ));
}
