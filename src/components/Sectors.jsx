import { ArrowRight, ArrowUpRight, ConciergeBell, HardHat, Sprout, TrainFront } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import { LinePattern, Section } from "./ui.jsx";
import { gsap, reducedMotion } from "../motion.js";
import { ABOUT_PAGE, CASE_STUDIES, EMPLOYERS, IMPACT, SECTORS, SECTORS_COPY } from "../content.js";

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

/** Heading words as separate inline blocks so each can rise on its own. */
function Words({ text }) {
  return text.split(" ").map((w, i, all) => (
    <span key={i}>
      <span data-rise className="inline-block">
        {w}
      </span>
      {i < all.length - 1 && " "}
    </span>
  ));
}

/*
 * Stats row under the heading (reference: a sliding row of results). The 2022-2023
 * figures run as a slow, endless ticker; hovering pauses it, reduced motion stops it.
 */
function StatsRow() {
  const items = IMPACT.metrics.map((m) => (
    <li key={m.id} className="flex shrink-0 items-baseline gap-3 px-8 lg:px-10">
      <span className="font-display text-3xl font-bold tracking-tight text-slate-900 tabular-nums lg:text-4xl">
        {m.value.toLocaleString("en-IN")}
        <span className="text-emerald-600">{m.suffix}</span>
      </span>
      <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">{m.label}</span>
    </li>
  ));
  return (
    <div data-stats className="mt-14 flex w-full items-center gap-6 border-t border-slate-200/80 pt-8 text-left lg:mt-16">
      <p className="hidden w-44 shrink-0 text-sm leading-snug text-slate-600 md:block">
        <span className="mr-1 text-emerald-600">/</span>
        {IMPACT.headline}
      </p>
      <div className="group/ticker relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        {/* Two copies back to back; the track slides by one copy's width, then loops */}
        <ul aria-label={IMPACT.headline} className="flex w-max motion-safe:animate-[marquee_32s_linear_infinite] group-hover/ticker:[animation-play-state:paused]">
          {items}
          <li aria-hidden className="contents">
            {IMPACT.metrics.map((m) => (
              <span key={m.id} className="flex shrink-0 items-baseline gap-3 px-8 lg:px-10">
                <span className="font-display text-3xl font-bold tracking-tight text-slate-900 tabular-nums lg:text-4xl">
                  {m.value.toLocaleString("en-IN")}
                  <span className="text-emerald-600">{m.suffix}</span>
                </span>
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">{m.label}</span>
              </span>
            ))}
          </li>
        </ul>
      </div>
    </div>
  );
}

/*
 * Split-photo grid for the intro stage: rects are % of the grid box (a bento with a
 * tall left tile). The first tile is the one the others merge into, and the photo
 * that ends up in the heading. Sharpest photos the site has (the 270px sector photos
 * would blur at full screen).
 */
const TILES = [
  { src: ABOUT_PAGE.photo, x: 0, y: 0, w: 34, h: 100, pos: "object-center" },
  { src: EMPLOYERS.sectors[0].image, x: 34, y: 0, w: 33, h: 52, pos: "object-center" }, // construction
  { src: EMPLOYERS.sectors[1].image, x: 67, y: 0, w: 33, h: 52, pos: "object-center" }, // hospitality
  { src: CASE_STUDIES.stories[0].image, x: 34, y: 52, w: 44, h: 48, pos: "object-center" }, // logistics
  { src: EMPLOYERS.sectors[3].image, x: 78, y: 52, w: 22, h: 48, pos: "object-center" }, // shipyard
];

/**
 * Intro stage (reference: full-screen split collage that scrolls down into one image).
 * The stage pins with our photos split across a full-screen bento grid; scrolling
 * shrinks the grid toward a slot inside the heading while the tiles merge into one
 * photo, which lands in the slot as the heading copy fades in around it.
 * Desktop + motion-allowed only; elsewhere the single photo simply sits in its slot.
 */
function SectorsStage({ onSearch }) {
  const stage = useRef(null);
  const slot = useRef(null);
  const grid = useRef(null);
  const still = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      if (reducedMotion()) return;
      const tiles = gsap.utils.toArray(grid.current.querySelectorAll("[data-tile]"));
      const imgs = gsap.utils.toArray(grid.current.querySelectorAll("[data-tile] img"));
      const fade = stage.current.querySelectorAll("[data-fade]");
      const rise = stage.current.querySelectorAll("[data-rise]");
      const stats = stage.current.querySelector("[data-stats]");

      // Grid box: full screen below the navbar at the start, the heading slot at the end
      // (both relative to the stage, which is what the grid is positioned in)
      // (full = edge to edge of the viewport, 16px margin, so it reaches past the section's padding)
      const full = () => {
        const s = stage.current.getBoundingClientRect();
        const vw = document.documentElement.clientWidth;
        return { left: 16 - s.left, top: 84, width: vw - 32, height: window.innerHeight - 100 };
      };
      const inSlot = () => {
        const s = stage.current.getBoundingClientRect();
        const t = slot.current.getBoundingClientRect();
        return { left: t.left - s.left, top: t.top - s.top, width: t.width, height: t.height };
      };

      gsap.set(still.current, { autoAlpha: 0 }); // the grid's merged photo replaces it
      gsap.set(grid.current, { display: "block" });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: stage.current,
          start: "top top",
          end: "+=270%",
          scrub: 0.7,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      // 1. Hold the split grid briefly while the photos drift (depth, like the reference)
      tl.fromTo(imgs, { scale: 1.14 }, { scale: 1, ease: "none", duration: 1 }, 0);
      // 2. The grid shrinks toward the heading slot...
      tl.fromTo(
        grid.current,
        { left: () => full().left, top: () => full().top, width: () => full().width, height: () => full().height, borderRadius: 28, "--g": "5px" },
        { left: () => inSlot().left, top: () => inSlot().top, width: () => inSlot().width, height: () => inSlot().height, borderRadius: 12, "--g": "0px", duration: 0.75 },
        0.2
      );
      // ...while every tile slides into the first one's frame and the extras fade away
      tl.to(tiles, { left: "0%", top: "0%", width: "100%", height: "100%", borderRadius: 0, duration: 0.6, stagger: 0.03 }, 0.25);
      tl.to(tiles.slice(1), { autoAlpha: 0, duration: 0.25, stagger: 0.03 }, 0.55);
      // 3. The giant heading rises up from below the screen, word by word, past the
      //    landed photo (which holds still in its slot) and settles around it
      tl.from(rise, { y: () => window.innerHeight * 0.65, opacity: 0, stagger: 0.06, duration: 0.55, ease: "power3.out" }, 0.72);
      tl.from(fade, { opacity: 0, y: 24, stagger: 0.06, duration: 0.3, ease: "power2.out" }, 1.1);
      // 4. The stats row slides in from the right, then a short hold before the pin releases
      tl.from(stats, { x: 120, opacity: 0, duration: 0.45, ease: "power3.out" }, 1.3); // small offset: a 35% shift pushed it past the viewport edge
      tl.to({}, { duration: 0.25 });
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

      {/* Full-screen split grid (motion mode only; GSAP shows and positions it) */}
      <div
        ref={grid}
        aria-hidden
        className="absolute z-20 hidden overflow-hidden will-change-[left,top,width,height]"
        style={{ "--g": "5px" }}
      >
        {TILES.map((t) => (
          <div
            key={t.src}
            data-tile
            className="absolute p-[var(--g)]"
            style={{ left: `${t.x}%`, top: `${t.y}%`, width: `${t.w}%`, height: `${t.h}%`, borderRadius: 16 }}
          >
            <div className="relative size-full overflow-hidden rounded-[inherit] bg-slate-100">
              <img src={t.src} alt="" className={`absolute inset-0 size-full object-cover ${t.pos}`} />
            </div>
          </div>
        ))}
      </div>
      <p data-fade className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
        {SECTORS_COPY.tag}
      </p>
      <h2 id="sectors-title" className="mt-5 max-w-6xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl lg:text-7xl xl:text-[5.5rem]">
        <Words text={lead} />{" "}
        {/* Slot the merged photo lands in — sized in em so it scales with the heading.
            The still copy shows on phones / reduced motion; the animated grid covers it otherwise. */}
        <span ref={slot} aria-hidden className="relative z-10 mx-[0.08em] inline-block h-[0.92em] w-[1.3em] align-[-0.14em]">
          <img
            ref={still}
            src={TILES[0].src}
            alt=""
            className="absolute inset-0 size-full rounded-[0.16em] object-cover shadow-xl shadow-slate-900/10"
          />
        </span>{" "}
        <span className="text-slate-500">
          {rest.length > 0 && <Words text={rest.join(" ")} />}{" "}
          <span data-rise className="inline-block whitespace-nowrap">
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
      <StatsRow />
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
