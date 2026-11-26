import { ArrowRight, ArrowUpRight, ConciergeBell, HardHat, Sprout, TrainFront } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import { LinePattern, Section } from "./ui.jsx";
import { gsap, reducedMotion } from "../motion.js";
import { SECTORS, SECTORS_COPY } from "../content.js";

const ICONS = { hospitality: ConciergeBell, railway: TrainFront, agriculture: Sprout, construction: HardHat };

/** White bento card: inset photo (zooms on hover), icon, title and "Explore Talent". */
function SectorCard({ sector, index }) {
  const Icon = ICONS[sector.id];
  return (
    <a
      href={`/employers?sector=${sector.id}`}
      data-reveal
      style={{ "--d": `${index * 90}ms` }}
      className="spotlight group flex flex-col rounded-3xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-600/50 focus-visible:-translate-y-1"
    >
      {/* 4:3 crop framed on the upper-middle of the photo: the source images carry a red
          overlay baked into their lower ~40% (from the old site), which this keeps out of view */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">
        <img
          src={sector.image}
          alt=""
          loading="lazy"
          className="size-full object-cover object-[center_25%] transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <span aria-hidden className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 font-display text-xs font-semibold text-slate-900 shadow-sm backdrop-blur">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/90 text-slate-900 shadow-sm backdrop-blur transition-colors duration-300 group-hover:bg-emerald-700 group-hover:text-white">
          <ArrowUpRight className="size-4" aria-hidden />
        </span>
      </div>

      <div className="flex items-center gap-3 px-3 pb-3 pt-5">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-100">
          <Icon className="size-5" strokeWidth={1.6} aria-hidden />
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-xl font-semibold tracking-tight text-slate-900">{sector.title}</h3>
          <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-700">
            Explore talent
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
          </span>
        </div>
      </div>
    </a>
  );
}

/**
 * Intro stage: a 2x2 collage of the sector photos starts large in the centre and,
 * as the visitor scrolls (stage pinned), shrinks into a slot inside the heading
 * while the copy fades in around it. Desktop + motion-allowed only; elsewhere the
 * collage simply sits in its slot.
 */
function SectorsStage({ onSearch }) {
  const stage = useRef(null);
  const slot = useRef(null);
  const collage = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      if (reducedMotion()) return;
      const big = () => Math.min(560, window.innerHeight * 0.62);
      // Offset from the slot to the stage centre (both move together while pinned)
      const delta = () => {
        const s = stage.current.getBoundingClientRect();
        const t = slot.current.getBoundingClientRect();
        return {
          x: s.left + s.width / 2 - (t.left + t.width / 2),
          y: s.top + s.height / 2 - (t.top + t.height / 2),
          scale: big() / t.width,
        };
      };
      const fade = stage.current.querySelectorAll("[data-fade]");

      gsap
        .timeline({
          scrollTrigger: {
            trigger: stage.current,
            start: "top 80%",
            end: "top 20%",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        })
        .from(collage.current, {
          x: () => delta().x,
          y: () => delta().y,
          scale: () => delta().scale,
          force3D: false, // keep the photos crisp while scaling
          ease: "power2.inOut",
          duration: 1,
        })
        .from(fade, { opacity: 0, y: 24, stagger: 0.06, duration: 0.45, ease: "power2.out" }, 0.5);

      // Appear on approach: the collage stays hidden until the visitor scrolls down to it,
      // then fades in and sharpens as the stage rises into view (before the pin starts)
      gsap.fromTo(
        collage.current,
        { autoAlpha: 0, filter: "blur(14px)" },
        {
          autoAlpha: 1,
          filter: "blur(0px)",
          ease: "power1.out",
          scrollTrigger: { trigger: stage.current, start: "top 75%", end: "top 15%", scrub: 0.6 },
        }
      );
    });
    return () => mm.revert();
  }, []);

  const words = SECTORS_COPY.headline.replace(/\.$/, "").split(" ");
  const lead = words.slice(0, SECTORS_COPY.headlineSplit).join(" ");
  const rest = words.slice(SECTORS_COPY.headlineSplit);
  const last = rest.pop();

  return (
    <div ref={stage} className="relative isolate flex flex-col items-center text-center md:min-h-[100svh] md:justify-center">
      <LinePattern className="inset-x-0 top-1/2 h-[520px] -translate-y-1/2" />
      <p data-fade className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
        {SECTORS_COPY.tag}
      </p>
      <h2 id="sectors-title" className="mt-5 max-w-5xl font-display text-4xl font-bold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-7xl">
        <span data-fade className="inline">{lead}</span>{" "}
        {/* Slot the collage lands in — sized in em so it scales with the heading */}
        <span ref={slot} aria-hidden className="relative z-10 mx-[0.08em] inline-block size-[0.92em] align-[-0.14em]">
          <span
            ref={collage}
            className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-[4%] overflow-hidden rounded-[0.16em] bg-white p-[4%] shadow-xl shadow-slate-900/10 ring-1 ring-slate-200/80"
          >
            {/* Square crops from the top keep the photos' baked-in red caption band out of view */}
            {SECTORS.map((s) => (
              <img key={s.id} src={s.image} alt="" className="size-full min-h-0 rounded-[0.08em] object-cover object-top" />
            ))}
          </span>
        </span>{" "}
        <span data-fade className="inline text-slate-500">
          {rest.length > 0 && `${rest.join(" ")} `}
          <span className="whitespace-nowrap">
            {last}
            <span aria-hidden className="ml-[0.06em] inline-block size-[0.17em] rounded-full bg-emerald-500" />
          </span>
        </span>
      </h2>
      <a
        data-fade
        href="#inquiry"
        onClick={onSearch}
        className="group mt-10 inline-flex items-center gap-2 font-semibold text-emerald-700 transition-colors hover:text-emerald-900"
      >
        {SECTORS_COPY.subtitle}
        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
      </a>
    </div>
  );
}

/** Section 2 — collage intro stage, then the industry sectors bento grid. */
export default function Sectors({ onSearch }) {
  return (
    <Section id="sectors" labelledBy="sectors-title">
      <SectorsStage onSearch={onSearch} />

      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mt-4 lg:grid-cols-4">
        {SECTORS.map((s, i) => (
          <SectorCard key={s.id} sector={s} index={i} />
        ))}
      </div>
    </Section>
  );
}
