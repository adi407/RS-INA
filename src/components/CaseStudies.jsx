import { useEffect, useRef, useState } from "react";
import { ArrowRight, Building2, MapPin } from "lucide-react";
import { BTN_PRIMARY } from "./ui.jsx";
import { CASE_STUDIES, PLATFORM } from "../content.js";

const AUTOPLAY_MS = 6000;

/**
 * Section 8 — case studies in the same form as "Save Time And Get The Best Talent":
 * sticky heading + client tabs on the left, a showcase card on the right that swaps
 * to the selected client. Tabs auto-advance while on screen, pause on hover/focus,
 * stop once the visitor picks one, and stay still for reduced motion.
 */
export default function CaseStudies({ onConsult }) {
  const { stories } = CASE_STUDIES;
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);
  const tabRefs = useRef([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setAutoplay(false);
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    if (sectionRef.current) io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  const running = autoplay && inView && !paused;
  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setActive((i) => (i + 1) % stories.length), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [running, active, stories.length]);

  const select = (i) => {
    setAutoplay(false);
    setActive(i);
  };

  const onKeyDown = (e) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!step && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    const next = e.key === "Home" ? 0 : e.key === "End" ? stories.length - 1 : (active + step + stories.length) % stories.length;
    select(next);
    tabRefs.current[next]?.focus();
  };

  const s = stories[active];

  return (
    <section ref={sectionRef} id="case-studies" aria-labelledby="cases-title" className="scroll-mt-20 bg-white px-6 py-24 md:px-12">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-12 lg:grid-cols-12">
        {/* ---------- Left: sticky editorial column ---------- */}
        <div className="lg:sticky lg:top-28 lg:col-span-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">{CASE_STUDIES.tag}</p>
          <h2 id="cases-title" className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl">
            {CASE_STUDIES.headline}
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-slate-600">{CASE_STUDIES.subtitle}</p>

          <div
            role="tablist"
            aria-label="Case studies"
            aria-orientation="vertical"
            onKeyDown={onKeyDown}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            className="mt-10 space-y-2"
          >
            {stories.map((item, i) => {
              const on = i === active;
              return (
                <button
                  key={item.id}
                  ref={(el) => (tabRefs.current[i] = el)}
                  type="button"
                  role="tab"
                  id={`case-tab-${item.id}`}
                  aria-selected={on}
                  aria-controls="case-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => select(i)}
                  className={`group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border px-5 py-4 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                    on ? "border-slate-200/80 bg-white shadow-lg shadow-slate-900/5" : "border-transparent hover:bg-slate-50"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`absolute inset-y-3 left-0 w-1 rounded-r-full transition-colors duration-300 ${on ? "bg-emerald-500" : "bg-transparent"}`}
                  />
                  <span className={`font-display text-sm font-semibold tabular-nums ${on ? "text-emerald-600" : "text-slate-400"}`}>
                    0{i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block font-display text-lg font-semibold tracking-tight transition-colors ${
                        on ? "text-slate-900" : "text-slate-500 group-hover:text-slate-800"
                      }`}
                    >
                      {item.client}
                    </span>
                    <span className="block text-sm text-slate-400">{item.region}</span>
                  </span>
                  <ArrowRight
                    aria-hidden
                    className={`size-4 transition-all duration-300 ${
                      on ? "translate-x-0 text-emerald-600 opacity-100" : "-translate-x-2 text-slate-400 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                    }`}
                  />
                  {on && autoplay && (
                    <span
                      key={active}
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-emerald-500/60"
                      style={{ animation: `progress ${AUTOPLAY_MS}ms linear forwards`, animationPlayState: running ? "running" : "paused" }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <a href="#inquiry" onClick={onConsult} className={`${BTN_PRIMARY} mt-10`}>
            {PLATFORM.primaryCta}
            <ArrowRight className="size-[18px] transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
          </a>
        </div>

        {/* ---------- Right: showcase card in a warm gradient frame ---------- */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-slate-200/80 bg-gradient-to-br from-amber-100/40 via-orange-50/20 to-emerald-50/30 p-3 shadow-xl shadow-slate-900/5">
            <div
              id="case-panel"
              role="tabpanel"
              aria-labelledby={`case-tab-${s.id}`}
              className="rounded-2xl border border-slate-200/60 bg-white p-8 lg:p-10"
            >
              {/* key re-mounts the content so the fade-up plays on every switch */}
              <div key={s.id} className="motion-safe:animate-[fade-up_0.45s_ease-out]">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-4">
                    <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-100">
                      <Building2 className="size-7" strokeWidth={1.5} aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-display text-base font-semibold text-slate-900">{s.client}</p>
                      <p className="flex items-center gap-1 text-sm text-slate-500">
                        <MapPin className="size-3.5 text-emerald-600" aria-hidden />
                        {s.region}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 font-display text-sm font-semibold tabular-nums text-slate-400">
                    <span className="text-slate-900">0{active + 1}</span> / 0{stories.length}
                  </span>
                </div>

                <h3 className="mt-8 font-display text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">{s.metric}</h3>

                <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-slate-100">
                  <img src={s.image} alt="" loading="lazy" className={`size-full object-cover ${s.imagePosition ?? "object-center"}`} />
                  <span className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm">
                    Case study 0{active + 1}
                  </span>
                </div>

                {/* Min-height fits the longest story so the card doesn't jump on switch */}
                <p className="mt-8 text-base leading-relaxed text-slate-600 sm:min-h-[5rem]">{s.body}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
