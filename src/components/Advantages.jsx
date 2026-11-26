import { useLayoutEffect, useRef } from "react";
import { ArrowRight, ArrowUpRight, BadgeCheck, Landmark, PiggyBank, Plane } from "lucide-react";
import { BlurGroup, BTN_PRIMARY, TwoTone, Words } from "./ui.jsx";
import { gsap, reducedMotion } from "../motion.js";
import { ADVANTAGES } from "../content.js";

const ICONS = { mobilization: Plane, security: BadgeCheck, affordability: PiggyBank, government: Landmark };

/*
 * Where each column starts before it assembles (desktop). Columns fan out from the centre:
 * spread sideways, offset up/down alternately and tilted in 3D, then scroll brings them
 * together into one seamless panel (BlueSquareX "Vision + Experience" style).
 */
const SCATTER = [
  { x: -70, y: 40, rotateY: 16, rotateZ: -2.5 },
  { x: -24, y: -50, rotateY: 7, rotateZ: 1.5 },
  { x: 24, y: 50, rotateY: -7, rotateZ: -1.5 },
  { x: 70, y: -40, rotateY: -16, rotateZ: 2.5 },
];

/** One column: photo + dark text panel; even columns put the text on top. */
function PillarCard({ pillar, index }) {
  const Icon = ICONS[pillar.id];
  const textFirst = index % 2 === 1;
  return (
    <article
      data-col
      className={`group flex flex-col overflow-hidden rounded-xl bg-[#0B0F17] shadow-2xl shadow-slate-900/25 ring-1 ring-black/5 lg:h-[600px] ${
        textFirst ? "lg:flex-col-reverse" : ""
      }`}
    >
      {/* Photo — fills whatever height the text leaves */}
      <div className="relative h-56 shrink-0 overflow-hidden sm:h-64 lg:h-auto lg:min-h-0 lg:flex-1">
        <img
          src={pillar.image}
          alt=""
          loading="lazy"
          className={`absolute inset-0 size-full object-cover ${pillar.position} transition-transform duration-700 ease-out group-hover:scale-105`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        {pillar.badge && (
          <span className="absolute bottom-3 left-3 right-3 truncate rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-emerald-700 shadow-sm">
            {pillar.badge}
          </span>
        )}
      </div>

      {/* Text panel */}
      <div className="flex flex-col p-6 lg:p-7">
        <span className="grid size-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
          <Icon className="size-5" strokeWidth={1.6} aria-hidden />
        </span>
        <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-white">{pillar.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">{pillar.body}</p>
      </div>
    </article>
  );
}

/**
 * Section 4 — Advantages as an assembling card panel: the four pillars start fanned out
 * and tilted, and lock together into one seamless panel as the section scrolls into view.
 * Desktop + motion allowed; elsewhere the cards simply sit in a grid.
 */
export default function Advantages({ onSearch }) {
  const panel = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      if (reducedMotion()) return;
      const cols = gsap.utils.toArray("[data-col]", panel.current);
      gsap
        .timeline({
          scrollTrigger: { trigger: panel.current, start: "top 95%", end: "top 30%", scrub: 0.8 },
        })
        .from(cols, {
          x: (i) => SCATTER[i].x,
          y: (i) => SCATTER[i].y,
          rotateY: (i) => SCATTER[i].rotateY,
          rotateZ: (i) => SCATTER[i].rotateZ,
          rotateX: 8,
          scale: 0.92,
          ease: "power2.out",
          duration: 1,
        })
        // The gaps close in the second half, so the columns meet edge to edge
        .fromTo(panel.current, { columnGap: 28 }, { columnGap: 0, ease: "power2.inOut", duration: 0.6 }, 0.4);
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="advantages" aria-labelledby="advantages-title" className="wash-tint scroll-mt-20 overflow-hidden px-6 py-24 md:px-12">
      <div className="mx-auto max-w-7xl">
        <BlurGroup as="header" className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700"><Words text={ADVANTAGES.tag} /></p>
          <h2 id="advantages-title" className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 lg:text-5xl">
            <TwoTone text={ADVANTAGES.headline} split={ADVANTAGES.headlineSplit} />
          </h2>
        </BlurGroup>

        <div className="mt-16 [perspective:1400px]">
          <div ref={panel} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:[transform-style:preserve-3d]">
            {ADVANTAGES.pillars.map((p, i) => (
              <PillarCard key={p.id} pillar={p} index={i} />
            ))}
          </div>
        </div>

        <div className="mt-14 flex justify-center">
          <a href="#inquiry" onClick={onSearch} className={BTN_PRIMARY}>
            {ADVANTAGES.cta}
            <ArrowRight className="size-[18px] transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}
