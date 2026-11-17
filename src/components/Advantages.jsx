import { useEffect, useRef, useState } from "react";
import { ArrowRight, BadgeCheck, Landmark, PiggyBank, Plane } from "lucide-react";
import { BTN_PRIMARY, TwoTone } from "./ui.jsx";
import { ADVANTAGES } from "../content.js";

const ICONS = { mobilization: Plane, security: BadgeCheck, affordability: PiggyBank, government: Landmark };
const AUTOPLAY_MS = 6000;

/**
 * Section 3 — asymmetric split on slate-50: sticky heading + feature tabs on the left,
 * a white showcase card on the right that swaps to the selected pillar.
 * Tabs auto-advance while the section is on screen, pause on hover/focus,
 * and stop for good once the visitor picks one. Disabled for reduced motion.
 */
export default function Advantages({ onSearch }) {
  const { pillars } = ADVANTAGES;
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);
  const tabRefs = useRef([]);

  // Only autoplay while visible, and never with reduced motion
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setAutoplay(false);
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    if (sectionRef.current) io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  const running = autoplay && inView && !paused;
  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setActive((i) => (i + 1) % pillars.length), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [running, active, pillars.length]);

  const select = (i) => {
    setAutoplay(false);
    setActive(i);
  };

  // Arrow-key navigation between tabs (WAI-ARIA tabs pattern)
  const onKeyDown = (e) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!step && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    const next = e.key === "Home" ? 0 : e.key === "End" ? pillars.length - 1 : (active + step + pillars.length) % pillars.length;
    select(next);
    tabRefs.current[next]?.focus();
  };

  const p = pillars[active];
  const Icon = ICONS[p.id];

  return (
    <section ref={sectionRef} id="advantages" aria-labelledby="advantages-title" className="scroll-mt-20 bg-slate-50 px-6 py-24 md:px-12">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-12 lg:grid-cols-12">
        {/* ---------- Left: sticky editorial column ---------- */}
        <div data-reveal className="lg:sticky lg:top-28 lg:col-span-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">{ADVANTAGES.tag}</p>
          <h2 id="advantages-title" className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl">
            <TwoTone text={ADVANTAGES.headline} split={ADVANTAGES.headlineSplit} />
          </h2>

          <div
            role="tablist"
            aria-label="Our advantages"
            aria-orientation="vertical"
            onKeyDown={onKeyDown}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            className="mt-10 space-y-2"
          >
            {pillars.map((item, i) => {
              const on = i === active;
              return (
                <button
                  key={item.id}
                  ref={(el) => (tabRefs.current[i] = el)}
                  type="button"
                  role="tab"
                  id={`adv-tab-${item.id}`}
                  aria-selected={on}
                  aria-controls="adv-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => select(i)}
                  className={`group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border px-5 py-4 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                    on
                      ? "border-slate-200/80 bg-white shadow-lg shadow-slate-900/5"
                      : "border-transparent hover:bg-white/70"
                  }`}
                >
                  {/* Emerald left rail */}
                  <span
                    aria-hidden
                    className={`absolute inset-y-3 left-0 w-1 rounded-r-full transition-colors duration-300 ${on ? "bg-emerald-500" : "bg-transparent"}`}
                  />
                  <span className={`font-display text-sm font-semibold tabular-nums ${on ? "text-emerald-600" : "text-slate-400"}`}>
                    0{i + 1}
                  </span>
                  <span
                    className={`flex-1 font-display text-lg font-semibold tracking-tight transition-colors ${
                      on ? "text-slate-900" : "text-slate-500 group-hover:text-slate-800"
                    }`}
                  >
                    {item.title}
                  </span>
                  <ArrowRight
                    aria-hidden
                    className={`size-4 transition-all duration-300 ${on ? "translate-x-0 text-emerald-600 opacity-100" : "-translate-x-2 text-slate-400 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"}`}
                  />
                  {/* Autoplay progress bar */}
                  {on && autoplay && (
                    <span
                      key={active}
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-emerald-500/60"
                      style={{
                        animation: `progress ${AUTOPLAY_MS}ms linear forwards`,
                        animationPlayState: running ? "running" : "paused",
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <a href="#inquiry" onClick={onSearch} className={`${BTN_PRIMARY} mt-10`}>
            {ADVANTAGES.cta}
            <ArrowRight className="size-[18px] transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
          </a>
        </div>

        {/* ---------- Right: dynamic showcase card ---------- */}
        <div data-reveal style={{ "--d": "120ms" }} className="lg:col-span-7">
          <div
            id="adv-panel"
            role="tabpanel"
            aria-labelledby={`adv-tab-${p.id}`}
            className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-900/5 lg:p-10"
          >
            {/* key={p.id} re-mounts the content so the fade-up plays on every switch */}
            <div key={p.id} className="motion-safe:animate-[fade-up_0.45s_ease-out]">
              <div className="flex items-center justify-between">
                <span className="grid size-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-100">
                  <Icon className="size-7" strokeWidth={1.5} aria-hidden />
                </span>
                <span className="font-display text-sm font-semibold tabular-nums text-slate-400">
                  <span className="text-slate-900">0{active + 1}</span> / 0{pillars.length}
                </span>
              </div>

              <h3 className="mt-8 font-display text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">{p.title}</h3>

              {/* Contextual image */}
              <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-slate-100">
                <img src={p.image} alt="" className={`size-full object-cover ${p.position}`} loading="lazy" />
                {p.badge && (
                  <span className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm">
                    {p.badge}
                  </span>
                )}
              </div>

              {/* Min-height fits the longest pillar text so the card doesn't jump on switch */}
              <p className="mt-8 text-base leading-relaxed text-slate-600 sm:min-h-[6.5rem]">{p.body}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
