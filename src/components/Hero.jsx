import { useEffect, useRef, useState } from "react";
import { reducedMotion } from "../motion.js";
import { ArrowRight, Pause, Play } from "lucide-react";
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

/**
 * Rolls through WORDS once (each sector), then settles back on "Your Industry" and stops,
 * so the headline doesn't move forever (WCAG 2.2.2). Stops at once when paused;
 * static under reduced motion.
 */
function RollingWord({ paused }) {
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (reducedMotion() || paused || done) return;
    const next = setTimeout(() => {
      const to = (index + 1) % WORDS.length;
      setPrev(index);
      setIndex(to);
      if (to === 0) setDone(true);
    }, HOLD_MS);
    return () => clearTimeout(next);
  }, [index, paused, done]);

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
/** Phones, data-saver mode and reduced motion get the still poster instead of video. */
const videoAllowed = () =>
  !reducedMotion() && window.matchMedia("(min-width: 768px)").matches && !navigator.connection?.saveData;

/**
 * Plays HERO.videos one after another in a loop. Each video sits in its own layer;
 * shortly before the active one ends, the next restarts from 0 and fades in over it.
 */
function useVideoPlaylist(count) {
  const refs = useRef([]);
  const [active, setActive] = useState(0);
  const [enabled] = useState(videoAllowed);
  const [playing, setPlaying] = useState(enabled);
  const [progress, setProgress] = useState(0);
  const activeRef = useRef(0);
  const playingRef = useRef(enabled);
  const switching = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    const vids = refs.current;
    const play = (v) => {
      v.muted = true; // required for autoplay in every browser
      return v.play().catch(() => {}); // autoplay blocked: the poster stays
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

    const onTime = (e) => {
      const v = e.currentTarget;
      if (v !== vids[activeRef.current] || !v.duration) return;
      setProgress(v.currentTime / v.duration);
      const next = vids[(activeRef.current + 1) % count];
      if (v.currentTime > 2 && next && next.preload !== "auto") next.preload = "auto";
      if (v.duration - v.currentTime <= FADE_S) advance();
    };
    const onEnded = (e) => e.currentTarget === vids[activeRef.current] && advance();
    vids.forEach((v) => {
      v.addEventListener("timeupdate", onTime);
      v.addEventListener("ended", onEnded);
    });
    play(vids[0]);

    const onVisible = () => {
      const v = vids[activeRef.current];
      if (document.visibilityState === "visible" && v.paused && playingRef.current) play(v);
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      vids.forEach((v) => {
        v.removeEventListener("timeupdate", onTime);
        v.removeEventListener("ended", onEnded);
      });
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [count, enabled]);

  const toggle = () => {
    const v = refs.current[activeRef.current];
    const next = !playingRef.current;
    playingRef.current = next;
    setPlaying(next);
    if (!v) return;
    if (next) v.play().catch(() => {});
    else v.pause();
  };

  return { refs, active, enabled, playing, toggle, progress };
}

/** Pause / play for the background video, with a ring showing how far the clip has run. */
function PauseButton({ playing, onToggle, progress }) {
  const C = 2 * Math.PI * 21;
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={!playing}
      aria-label={playing ? "Pause background video and animation" : "Play background video"}
      className="relative grid size-12 place-items-center rounded-full bg-black/35 text-white backdrop-blur transition-colors hover:bg-black/55"
    >
      <svg viewBox="0 0 48 48" className="absolute inset-0 -rotate-90" aria-hidden>
        <circle cx="24" cy="24" r="21" fill="none" stroke="rgb(255 255 255 / 0.25)" strokeWidth="2" />
        <circle cx="24" cy="24" r="21" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - progress)} />
      </svg>
      {playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4 translate-x-px" aria-hidden />}
    </button>
  );
}

export default function Hero({ onSearch }) {
  const video = useVideoPlaylist(HERO.videos.length);

  return (
    // -mt-20 pulls the video up under the sticky (transparent-at-top) navbar
    <section
      id="top"
      className="relative isolate -mt-20 flex min-h-[calc(100svh-2.5rem)] items-end overflow-hidden bg-[#0A0F1D] shadow-[0_-2px_0_0_#0A0F1D]"
    >
      <div aria-hidden className="absolute inset-0 -z-10">
        {video.enabled ? (
          HERO.videos.map((v, i) => (
            <video
              key={v.src}
              ref={(el) => (video.refs.current[i] = el)}
              src={v.src}
              poster={v.poster}
              muted
              playsInline
              preload={i === 0 ? "auto" : "none"}
              className="absolute inset-0 size-full object-cover transition-opacity ease-in-out"
              style={{ opacity: i === video.active ? 1 : 0, transitionDuration: `${FADE_S * 1000}ms` }}
            />
          ))
        ) : (
          <img src={HERO.videos[0].poster} alt="" fetchPriority="high" className="absolute inset-0 size-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0A0F1D]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0F1D]/65 via-[#0A0F1D]/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#0A0F1D]/90 via-[#0A0F1D]/40 to-transparent" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-6 pb-16 pt-40 md:px-12 lg:pb-20">
        <h1 className="font-display text-[44px] font-medium leading-[1.04] tracking-[-0.03em] text-white sm:text-6xl lg:text-[84px]">
          <span className="sr-only">Recruit Top Talents In Your Industry</span>
          <span aria-hidden>
            <span className="block">Recruit Top Talents</span>
            <span className="block">
              In{" "}
              <span className="text-emerald-400">
                <RollingWord paused={!video.playing} />
              </span>
            </span>
          </span>
        </h1>

        <p className="mt-6 max-w-md text-lg leading-relaxed text-white/90">{HERO.subtitle}</p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          {/* Pill + round arrow, one button */}
          <button type="button" onClick={onSearch} className="group inline-flex items-center gap-1.5 rounded-full">
            <span className="flex min-h-12 items-center rounded-full bg-emerald-700 px-6 text-sm font-semibold uppercase tracking-wider text-white transition-colors duration-200 group-hover:bg-emerald-800">
              {HERO.cta}
            </span>
            <span className="grid size-12 place-items-center rounded-full bg-emerald-700 text-white transition-all duration-200 group-hover:bg-emerald-800">
              <ArrowRight className="size-[18px] transition-transform duration-300 group-hover:-rotate-45" aria-hidden />
            </span>
          </button>
          <a
            href="/jobs"
            className="inline-flex min-h-12 items-center rounded-full border border-white/60 px-6 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-white/10"
          >
            Find a job
          </a>
        </div>
      </div>

      {video.enabled && (
        <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10">
          <PauseButton playing={video.playing} onToggle={video.toggle} progress={video.progress} />
        </div>
      )}
    </section>
  );
}
