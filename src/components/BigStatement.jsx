import { useLayoutEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import { TwoTone } from "./ui.jsx";
import { gsap } from "../motion.js";
import { HERO, REGIONS } from "../content.js";

/**
 * Giant sideways-scrolling statement (nk.studio's "Inspired by people." band).
 * The hero tagline in huge two-tone type slides left as the band crosses the
 * screen, and the regions served drift the other way underneath.
 * Reduced motion: both rows simply sit still (the overflow is clipped).
 */
export default function BigStatement() {
  const band = useRef(null);
  const line = useRef(null);
  const chips = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const scrub = { trigger: band.current, start: "top bottom", end: "bottom top", scrub: 0.5, invalidateOnRefresh: true };
      gsap.fromTo(
        line.current,
        { x: () => window.innerWidth * 0.08 },
        { x: () => -(line.current.scrollWidth - window.innerWidth * 0.92), ease: "none", scrollTrigger: scrub }
      );
      gsap.fromTo(
        chips.current,
        { x: () => -window.innerWidth * 0.12 },
        { x: () => window.innerWidth * 0.12, ease: "none", scrollTrigger: { ...scrub } }
      );
    });
    return () => mm.revert();
  }, []);

  return (
    // Decorative restatement of the hero tagline, so it's hidden from screen readers
    <section ref={band} aria-hidden className="overflow-hidden bg-white py-24 lg:py-32">
      <p
        ref={line}
        className="w-max whitespace-nowrap px-6 font-display text-[17vw] font-extrabold leading-[0.95] tracking-tighter text-slate-900 md:text-[13vw]"
      >
        <TwoTone text={HERO.subtitle} split={3} />
      </p>

      <ul ref={chips} className="mt-12 flex justify-center gap-3 px-6">
        {REGIONS.map((r) => (
          <li
            key={r.id}
            className="flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm md:px-6 md:py-3 md:text-base"
          >
            <MapPin className="size-4 text-emerald-600" aria-hidden />
            {r.label}
          </li>
        ))}
      </ul>
    </section>
  );
}
