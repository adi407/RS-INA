import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Briefcase, Clock, ShieldCheck, Users } from "lucide-react";
import useCountUp from "../useCountUp.js";
import { CARD, ICON_TILE, Section, SectionHeader } from "./ui.jsx";
import { CASE_STUDIES, IMPACT, SECTORS } from "../content.js";
import { gsap, ScrollTrigger } from "../motion.js";

/* Dark-mode variants, active while the section carries data-dark="true" (group/theme) */
const DARK_CARD = "group-data-[dark=true]/theme:border-white/10 group-data-[dark=true]/theme:bg-white/[0.04] group-data-[dark=true]/theme:shadow-none";
const DARK_ICON = "group-data-[dark=true]/theme:bg-emerald-500/10 group-data-[dark=true]/theme:text-emerald-400 group-data-[dark=true]/theme:ring-emerald-500/20";

const ICONS = { projects: Briefcase, recruitment: Users, retention: ShieldCheck, support: Clock };

/** White stat card — the emerald value counts up when it scrolls into view. */
function MetricCard({ id, value, suffix, label, index }) {
  const [ref, n] = useCountUp(value);
  const Icon = ICONS[id];
  return (
    <div ref={ref} data-reveal style={{ "--d": `${index * 90}ms` }} className={`${CARD} ${DARK_CARD} group flex flex-col items-center text-center duration-700`}>
      <span className={`${ICON_TILE} ${DARK_ICON} order-1 transition-colors duration-300 group-hover:bg-emerald-600 group-hover:text-white`}>
        <Icon className="size-[22px]" strokeWidth={1.5} aria-hidden />
      </span>
      {/* dt precedes dd in the DOM (valid <dl>); CSS order shows the value above the label */}
      <dt className="order-3 text-sm font-medium text-slate-600 transition-colors duration-700 group-data-[dark=true]/theme:text-slate-400">{label}</dt>
      <dd className="order-2 mb-2 mt-6 font-display text-4xl font-extrabold tracking-tight text-emerald-600 tabular-nums transition-colors duration-700 group-data-[dark=true]/theme:text-emerald-400 lg:text-5xl">
        {n.toLocaleString("en-IN")}
        {suffix}
      </dd>
    </div>
  );
}

/*
 * Floating photos for the depth layer. Positions are % of the section, kept to the side
 * margins and the top/bottom bands so they never cover the stats. depth 0.3 (far) → 1 (near):
 * nearer photos are bigger, sharper and move more. side: -1 left, 1 right (scroll spread).
 * Sector photos carry a red caption band in their lower ~40%, so they're cropped from the top.
 */
const [hospitality, railway, agriculture, construction] = SECTORS.map((s) => s.image);
const [, siteWide, professional] = CASE_STUDIES.stories.map((s) => s.image);
const PHOTOS = [
  { src: hospitality, left: "2.5%", top: "12%", w: 190, depth: 1, side: -1, crop: "aspect-[5/4] object-top" },
  { src: agriculture, left: "1%", top: "58%", w: 120, depth: 0.45, side: -1, crop: "aspect-[5/4] object-top" },
  { src: construction, left: "17%", top: "3%", w: 120, depth: 0.3, side: -1, crop: "aspect-[5/4] object-top" },
  { src: railway, left: "83%", top: "4%", w: 150, depth: 0.5, side: 1, crop: "aspect-[5/4] object-top" },
  { src: professional, left: "89.6%", top: "40%", w: 130, depth: 0.95, side: 1, crop: "aspect-[4/5] object-top" },
  { src: siteWide, left: "72%", top: "80%", w: 200, depth: 0.7, side: 1, crop: "aspect-[16/10] object-center" },
];

/**
 * Photo depth parallax (desktop): the photos sit at different depths in a 3D layer that
 * tilts toward the mouse (near photos shift more), and drift upward / spread apart as the
 * section scrolls past. They fade in with the section's dark state. Reduced motion: static.
 */
function ImpactPhotos() {
  const layer = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const items = gsap.utils.toArray("[data-depth]", layer.current);

      // Scroll: drift up and spread outward, faster for nearer photos
      items.forEach((el) => {
        const d = Number(el.dataset.depth);
        const side = Number(el.dataset.side);
        gsap.set(el, { z: d * 140 });
        gsap.fromTo(
          el,
          { y: 150 * d, x: -30 * d * side },
          {
            y: -150 * d,
            x: 70 * d * side,
            ease: "none",
            scrollTrigger: { trigger: layer.current, start: "top bottom", end: "bottom top", scrub: 0.7 },
          }
        );
      });

      // Mouse: per-photo shift by depth + a gentle tilt of the whole layer
      const inners = items.map((el) => el.firstElementChild);
      const qx = inners.map((el) => gsap.quickTo(el, "x", { duration: 1, ease: "power3.out" }));
      const qy = inners.map((el) => gsap.quickTo(el, "y", { duration: 1, ease: "power3.out" }));
      const tiltX = gsap.quickTo(layer.current, "rotationX", { duration: 1.2, ease: "power3.out" });
      const tiltY = gsap.quickTo(layer.current, "rotationY", { duration: 1.2, ease: "power3.out" });
      const onMove = (e) => {
        const mx = (e.clientX / window.innerWidth) * 2 - 1;
        const my = (e.clientY / window.innerHeight) * 2 - 1;
        items.forEach((el, i) => {
          const d = Number(el.dataset.depth);
          qx[i](-mx * 40 * d);
          qy[i](-my * 28 * d);
        });
        tiltY(mx * 6);
        tiltX(-my * 4);
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      return () => window.removeEventListener("pointermove", onMove);
    });
    return () => mm.revert();
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-[5] hidden [perspective:1200px] lg:block">
      <div
        ref={layer}
        className="absolute inset-0 opacity-0 transition-opacity duration-1000 [transform-style:preserve-3d] group-data-[dark=true]/theme:opacity-100"
      >
        {PHOTOS.map((p) => (
          <div key={p.src} data-depth={p.depth} data-side={p.side} className="absolute" style={{ left: p.left, top: p.top, width: p.w }}>
            <div className="overflow-hidden rounded-2xl shadow-2xl shadow-black/50 ring-1 ring-white/10">
              <img
                src={p.src}
                alt=""
                loading="lazy"
                className={`w-full object-cover ${p.crop}`}
                style={{
                  // Depth of field: far photos softer and dimmer
                  filter: `blur(${((1 - p.depth) * 2.2).toFixed(1)}px) brightness(${0.55 + p.depth * 0.4})`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Section 10 — proven impact metrics. Flips the page from light to dark while the
 * section holds the middle of the screen (nk.studio-style), then back on leaving.
 */
export default function ImpactMetrics() {
  const ref = useRef(null);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: "top 55%",
      end: "bottom 45%",
      onToggle: (self) => setDark(self.isActive),
    });
    return () => st.kill();
  }, []);

  return (
    <Section
      ref={ref}
      id="impact"
      labelledBy="impact-title"
      data-dark={dark}
      bg={dark ? "bg-[#0A0F1D]" : "bg-white"}
      className="group/theme relative isolate overflow-hidden transition-colors duration-700 lg:py-40"
    >
      <ImpactPhotos />
      {/* Emerald glow that fades in with the dark state */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_55%_at_50%_100%,rgba(16,185,129,0.18),transparent)] opacity-0 transition-opacity duration-700 group-data-[dark=true]/theme:opacity-100"
      />
      <SectionHeader id="impact-title" tag={IMPACT.tag} title={IMPACT.headline} split={IMPACT.headlineSplit} align="center" />
      <dl className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {IMPACT.metrics.map((m, i) => (
          <MetricCard key={m.id} {...m} index={i} />
        ))}
      </dl>
    </Section>
  );
}
