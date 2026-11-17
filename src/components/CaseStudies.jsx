import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, MapPin, TrendingUp } from "lucide-react";
import { SectionHeader } from "./ui.jsx";
import { CASE_STUDIES } from "../content.js";

/* Offset backing tab behind each slide (the coloured frame in the reference) */
const TONES = {
  orange: "from-amber-300 via-orange-400 to-orange-300",
  rose: "from-fuchsia-300 via-rose-300 to-amber-200",
  emerald: "from-emerald-300 via-teal-300 to-lime-200",
};

/* Slide width — shared by the slides and the scroller's centring padding */
const SLIDE_W = "w-[min(1040px,86vw)]";
const SCROLL_PAD = "px-[max(1rem,calc((100%-min(1040px,86vw))/2))]";

function Slide({ story, index, total, active }) {
  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${total}: ${story.client}`}
      data-slide={index}
      className={`${SLIDE_W} relative shrink-0 snap-center pl-3 pt-3 transition-[opacity,scale] duration-500 ease-out sm:pl-4 sm:pt-4 ${
        active ? "scale-100 opacity-100" : "scale-[0.97] opacity-60"
      }`}
    >
      <span aria-hidden className={`absolute left-0 top-0 h-3/4 w-11/12 rounded-3xl bg-gradient-to-br ${TONES[story.tone]}`} />

      {/* Opaque white base under the translucent warm gradient, so the backing tab can't bleed through */}
      <article className="group relative rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-900/5 transition-all duration-300 hover:-translate-y-1">
        <span aria-hidden className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-100/40 via-orange-50/20 to-emerald-50/30" />
        <div className="relative m-4 grid overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/60 md:grid-cols-5">
          {/* Copy */}
          <div className="order-2 flex flex-col p-8 md:order-1 md:col-span-2 lg:p-10">
            <p className="font-display text-lg font-semibold text-slate-900">{story.client}</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin className="size-3.5 text-emerald-600" aria-hidden />
              {story.region}
            </p>

            <p className="mt-8 font-display text-3xl font-extrabold leading-[1.1] tracking-tight text-slate-900 lg:text-4xl">
              {story.metric}
            </p>
            <span aria-hidden className="mt-4 block h-1.5 w-14 rounded-full bg-emerald-500" />

            <p className="mt-6 text-base leading-relaxed text-slate-600">{story.body}</p>
          </div>

          {/* Photo */}
          <div className="relative order-1 aspect-[16/10] overflow-hidden md:order-2 md:col-span-3 md:aspect-auto md:min-h-[400px]">
            <img
              src={story.image}
              alt=""
              loading="lazy"
              className={`absolute inset-0 size-full object-cover ${story.imagePosition ?? "object-center"} transition-transform duration-700 ease-out group-hover:scale-105`}
            />
            <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm backdrop-blur">
              <TrendingUp className="size-3.5" aria-hidden />
              Case study 0{index + 1}
            </span>
          </div>
        </div>
      </article>
    </div>
  );
}

/** Section 8 — case studies: centred slide with neighbours peeking, scroll-snap + arrow controls. */
export default function CaseStudies() {
  const { stories } = CASE_STUDIES;
  const track = useRef(null);
  const [active, setActive] = useState(0);

  // Active slide = the one whose centre is nearest the scroller's centre
  const sync = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const mid = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    el.querySelectorAll("[data-slide]").forEach((s, i) => {
      const d = Math.abs(s.offsetLeft + s.offsetWidth / 2 - mid);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setActive(best);
  }, []);

  useEffect(() => {
    const el = track.current;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(sync);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [sync]);

  const go = (i) => {
    const el = track.current;
    const slide = el.querySelectorAll("[data-slide]")[i];
    if (!slide) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: slide.offsetLeft + slide.offsetWidth / 2 - el.clientWidth / 2, behavior: reduce ? "auto" : "smooth" });
  };

  const onKey = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(Math.min(active + 1, stories.length - 1));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(Math.max(active - 1, 0));
    }
  };

  const arrow =
    "grid size-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-all duration-200 hover:border-emerald-500 hover:text-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-40";

  return (
    <section id="case-studies" aria-labelledby="cases-title" className="scroll-mt-20 overflow-hidden bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <SectionHeader
          id="cases-title"
          tag={CASE_STUDIES.tag}
          title={CASE_STUDIES.headline}
          subtitle={CASE_STUDIES.subtitle}
          align="center"
        />
      </div>

      <div
        ref={track}
        role="region"
        aria-roledescription="carousel"
        aria-label="Case studies"
        tabIndex={0}
        onKeyDown={onKey}
        className={`mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6 pt-2 [scrollbar-width:none] focus-visible:outline-none [&::-webkit-scrollbar]:hidden ${SCROLL_PAD}`}
      >
        {stories.map((s, i) => (
          <Slide key={s.id} story={s} index={i} total={stories.length} active={i === active} />
        ))}
      </div>

      {/* Controls: arrows bottom-left, position bottom-right (RemotePeople flow) */}
      <div className={`mx-auto mt-6 flex items-center justify-between ${SLIDE_W}`}>
        <div className="flex gap-3">
          <button type="button" onClick={() => go(active - 1)} disabled={active === 0} aria-label="Previous case study" className={arrow}>
            <ArrowLeft className="size-[18px]" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => go(active + 1)}
            disabled={active === stories.length - 1}
            aria-label="Next case study"
            className={arrow}
          >
            <ArrowRight className="size-[18px]" aria-hidden />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden gap-1.5 sm:flex" aria-hidden>
            {stories.map((s, i) => (
              <span
                key={s.id}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? "w-8 bg-emerald-500" : "w-1.5 bg-slate-300"}`}
              />
            ))}
          </div>
          <p className="font-display text-sm font-semibold text-slate-900" aria-live="polite">
            0{active + 1}
            <span className="text-slate-400"> / 0{stories.length}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
