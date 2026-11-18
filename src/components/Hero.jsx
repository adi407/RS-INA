import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { HERO, SECTORS } from "../content.js";

/* The rolling last word: the original headline first, then each sector */
const WORDS = ["Your Industry", ...SECTORS.map((s) => s.title)];
const HOLD_MS = 2800; // how long each word stays before rolling to the next
const STAGGER_MS = 28; // delay between letters

/** A word split into letters that roll in (or out) one after another. */
function Letters({ text, mode }) {
  return (
    <span className="whitespace-nowrap">
      {[...text].map((ch, i) => (
        <span
          key={i}
          className="inline-block"
          style={
            mode === "static"
              ? undefined
              : {
                  animation: `${mode === "in" ? "roll-in" : "roll-out"} 700ms cubic-bezier(0.2, 0.7, 0.2, 1) both`,
                  animationDelay: `${i * STAGGER_MS}ms`,
                }
          }
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}

/** Cycles through WORDS with a letter-by-letter roll (static under reduced motion). */
function RollingWord() {
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const next = setTimeout(() => {
      setPrev(index);
      setIndex((index + 1) % WORDS.length);
    }, HOLD_MS);
    return () => clearTimeout(next);
  }, [index]);

  // Drop the outgoing word once it has rolled away, so the line width settles
  useEffect(() => {
    if (prev === null) return;
    const t = setTimeout(() => setPrev(null), 900);
    return () => clearTimeout(t);
  }, [prev]);

  return (
    // Both words share one grid cell; overflow-hidden clips letters as they roll
    <span className="inline-grid overflow-hidden pb-[0.14em] align-top [&>*]:col-start-1 [&>*]:row-start-1">
      {prev !== null && <Letters key={`out-${prev}-${index}`} text={WORDS[prev]} mode="out" />}
      <Letters key={`in-${index}`} text={WORDS[index]} mode={prev === null && index === 0 ? "static" : "in"} />
    </span>
  );
}

/**
 * Hero — full-screen video with a transparent navbar over it (EquitiFy-style):
 * bottom-left headline whose last word rolls through the sectors, subtitle,
 * and a pill + round-arrow CTA. Light tint: just a fade at the bottom and top for legibility.
 */
const FADE_S = 1.2; // crossfade length between the hero videos

/**
 * Plays HERO.videos one after another in an endless loop. Each video sits in its own
 * layer; shortly before the active one ends, the next restarts from 0 and fades in over
 * it (no cut, no black frame), then the old one pauses. Reduced motion: first poster only.
 */
function useVideoPlaylist(count) {
  const refs = useRef([]);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const switching = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const vids = refs.current;
    const play = (v) => {
      v.muted = true; // required for autoplay in every browser
      return v.play().catch(() => {}); // autoplay blocked (e.g. data saver): the poster stays
    };

    const advance = () => {
      if (switching.current || count < 2) return;
      switching.current = true;
      const from = activeRef.current;
      const to = (from + 1) % count;
      vids[to].currentTime = 0;
      play(vids[to]);
      activeRef.current = to;
      setActive(to);
      setTimeout(() => {
        vids[from].pause();
        switching.current = false;
      }, FADE_S * 1000 + 150);
    };

    // Start the crossfade just before the active video runs out
    const onTime = (e) => {
      const v = e.currentTarget;
      if (v !== vids[activeRef.current] || !v.duration) return;
      // A couple of seconds in, start buffering the next video so the crossfade never waits
      const next = vids[(activeRef.current + 1) % count];
      if (v.currentTime > 2 && next && next.preload !== "auto") next.preload = "auto";
      if (v.duration - v.currentTime <= FADE_S) advance();
    };
    const onEnded = (e) => e.currentTarget === vids[activeRef.current] && advance(); // safety net
    vids.forEach((v) => {
      v.addEventListener("timeupdate", onTime);
      v.addEventListener("ended", onEnded);
    });
    play(vids[0]);

    // Browsers pause background-tab video; resume the active one when the tab is shown again
    const onVisible = () => {
      const v = vids[activeRef.current];
      if (document.visibilityState === "visible" && v.paused) play(v);
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      vids.forEach((v) => {
        v.removeEventListener("timeupdate", onTime);
        v.removeEventListener("ended", onEnded);
      });
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [count]);

  return [refs, active];
}

export default function Hero({ onSearch }) {
  const [videoRefs, activeVideo] = useVideoPlaylist(HERO.videos.length);

  return (
    // -mt-20 pulls the video up under the sticky (transparent-at-top) navbar
    <section
      id="top"
      // The dark 2px shadow above covers a sub-pixel seam where the contact strip ends
      className="relative isolate -mt-20 flex min-h-[calc(100svh-2.5rem)] items-end overflow-hidden bg-[#0A0F1D] shadow-[0_-2px_0_0_#0A0F1D]"
    >
      <div aria-hidden className="absolute inset-0 -z-10">
        {HERO.videos.map((v, i) => (
          <video
            key={v.src}
            ref={(el) => (videoRefs.current[i] = el)}
            src={v.src}
            poster={v.poster}
            muted
            playsInline
            preload={i === 0 ? "auto" : "metadata"}
            className="absolute inset-0 size-full object-cover transition-opacity ease-in-out"
            style={{ opacity: i === activeVideo ? 1 : 0, transitionDuration: `${FADE_S * 1000}ms` }}
          />
        ))}
        <div className="absolute inset-0 bg-black/15" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0A0F1D]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0F1D]/55 via-[#0A0F1D]/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#0A0F1D]/85 via-[#0A0F1D]/35 to-transparent" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-6 pb-16 pt-40 md:px-12 lg:pb-20">
        <h1 className="font-display text-[44px] font-medium leading-[1.04] tracking-[-0.03em] text-white sm:text-6xl lg:text-[84px]">
          <span className="sr-only">Recruit Top Talents In Your Industry</span>
          <span aria-hidden>
            <span className="block">Recruit Top Talents</span>
            <span className="block">
              In <span className="text-emerald-400"><RollingWord /></span>
            </span>
          </span>
        </h1>

        <p className="mt-6 max-w-md text-lg leading-relaxed text-white/85">{HERO.subtitle}</p>

        {/* Pill + round arrow, one button */}
        <button
          type="button"
          onClick={onSearch}
          className="group mt-9 inline-flex items-center gap-1.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0F1D]"
        >
          <span className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-colors duration-200 group-hover:bg-emerald-500">
            {HERO.cta}
          </span>
          <span className="grid size-11 place-items-center rounded-full bg-emerald-600 text-white transition-all duration-200 group-hover:bg-emerald-500">
            <ArrowRight className="size-[18px] transition-transform duration-300 group-hover:-rotate-45" aria-hidden />
          </span>
        </button>
      </div>
    </section>
  );
}
