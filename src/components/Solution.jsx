import { ArrowRight, Check, FileCheck2, Landmark, ShieldCheck } from "lucide-react";
import { reducedMotion } from "../motion.js";
import { useEffect, useState } from "react";
import usePlayOnHover, { step } from "../usePlayOnHover.js";
import { BlurGroup, BTN_PRIMARY, Section, TwoTone, Words } from "./ui.jsx";
import { LICENSE, SOLUTION } from "../content.js";

const ICONS = { vetting: FileCheck2, compliance: Landmark, risk: ShieldCheck };

const STACK = "grid [&>*]:col-start-1 [&>*]:row-start-1";
const FADE = "transition-all duration-500 ease-out";
const METER_DELAY = 1150; // ms into the sequence, after the three checks

/** Counts 0 → target over `duration` after `delay` while `on`; snaps back to 0 when off. */
function useTween(on, target, delay, duration) {
  const [n, setN] = useState(on ? target : 0);
  useEffect(() => {
    if (!on) {
      setN(0);
      return;
    }
    if (reducedMotion()) {
      setN(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now() + delay;
    const tick = (now) => {
      const p = Math.min(1, Math.max(0, (now - t0) / duration));
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [on, target, delay, duration]);
  return n;
}

/**
 * "Assurance" card with a 1Centre-style demo: on hover (or once in view on touch) each
 * check resolves from "Pending" to verified in turn, the retention meter fills and counts
 * to 95%, then the status flips from "Reviewing" to "Active". Leaving resets it.
 */
function AssuranceCard({ on }) {
  const retention = useTween(on, SOLUTION.retention, METER_DELAY, 900);
  return (
    <div
      className={`rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl transition-all duration-500 ease-out ${
        on ? "-translate-y-1 shadow-slate-900/10" : "shadow-slate-900/5"
      }`}
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-100">
            <ShieldCheck className="size-5" strokeWidth={1.6} aria-hidden />
          </span>
          <div>
            <p className="font-display text-sm font-semibold text-slate-900">RS Assurance</p>
            <p className="text-xs text-slate-500 [overflow-wrap:anywhere]">Lic. {LICENSE}</p>
          </div>
        </div>
        <span className={`${STACK} shrink-0 justify-items-end`}>
          <span
            aria-hidden
            className={`${FADE} flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500 ${on ? "opacity-0" : "opacity-100"}`}
            style={step(on, METER_DELAY + 700)}
          >
            <span className="size-1.5 animate-pulse rounded-full bg-slate-400 motion-reduce:animate-none" />
            Reviewing
          </span>
          <span
            className={`${FADE} flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-700 ${
              on ? "scale-100 opacity-100" : "scale-90 opacity-0"
            }`}
            style={step(on, METER_DELAY + 700)}
          >
            <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden />
            Active
          </span>
        </span>
      </div>

      <ul className="divide-y divide-slate-100">
        {SOLUTION.assurances.map((a, i) => {
          const Icon = ICONS[a.id];
          const delay = 200 + i * 300;
          return (
            <li key={a.id} className="flex gap-4 py-5">
              <Icon
                className={`mt-0.5 size-5 shrink-0 transition-colors duration-500 ${on ? "text-emerald-700" : "text-slate-300"}`}
                style={step(on, delay)}
                strokeWidth={1.6}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-slate-900">{a.title}</p>
                  <span className={`${STACK} justify-items-end`}>
                    <span aria-hidden className={`${FADE} px-2 py-0.5 text-xs font-medium ${on ? "opacity-0" : "opacity-100"}`} style={step(on, delay)}>
                      <span className="text-shimmer">Pending</span>
                    </span>
                    <span
                      className={`${FADE} flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ${
                        on ? "translate-x-0 opacity-100" : "translate-x-2 opacity-0"
                      }`}
                      style={step(on, delay)}
                    >
                      <Check className="size-3.5" strokeWidth={2.5} aria-hidden />
                      {a.status}
                    </span>
                  </span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{a.body}</p>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="rounded-2xl bg-slate-50 p-4">
        <div className="flex items-baseline justify-between">
          <p className="text-sm text-slate-600">Worker Retention Rate</p>
          <p className="font-display text-2xl font-bold tabular-nums text-slate-900">
            {/* Visual number animates; screen readers always get the real figure */}
            <span aria-hidden>{retention}</span>
            <span className="sr-only">{SOLUTION.retention}</span>
            <span className="text-emerald-700">%</span>
          </p>
        </div>
        <div
          className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200"
          role="meter"
          aria-label="Worker retention rate"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={SOLUTION.retention}
        >
          <div
            className="h-full origin-left rounded-full bg-emerald-500 transition-transform duration-[900ms] ease-out"
            style={{ transform: `scaleX(${on ? SOLUTION.retention / 100 : 0})`, ...step(on, METER_DELAY) }}
          />
        </div>
        <p className="mt-2 text-xs text-slate-500">Successful Recruitment 2022–2023</p>
      </div>
    </div>
  );
}

/** Section 4 — executive featured banner on white. */
export default function Solution({ onSearch }) {
  const [demoRef, demoOn] = usePlayOnHover();
  return (
    <Section id="solution" labelledBy="solution-title">
      <div data-reveal className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-50 via-white to-emerald-50/60 p-8 shadow-xl shadow-slate-900/5 lg:p-14">
        {/* Soft dot grid, fading toward the copy */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(15,23,42,0.07)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_65%)]"
        />
        <div className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <BlurGroup>
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700"><Words text={SOLUTION.tag} /></p>
            <h2 id="solution-title" className="mt-4 max-w-xl font-display text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl">
              <TwoTone text={SOLUTION.headline} split={SOLUTION.headlineSplit} />
            </h2>
            <p className="mb-8 mt-4 max-w-lg text-lg leading-relaxed text-slate-600"><Words text={SOLUTION.subtitle} /></p>
            </BlurGroup>
            <a href="#inquiry" onClick={onSearch} className={BTN_PRIMARY}>
              {SOLUTION.cta}
              <ArrowRight className="size-[18px] transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
            </a>
          </div>
          <figure ref={demoRef} className="lg:col-span-5">
            <div aria-hidden="true">
              <AssuranceCard on={demoOn} />
            </div>
            <figcaption className="mt-3 text-right text-xs font-medium text-slate-600">
              <span className="sr-only">Illustration: our three assurance checks (vetting, compliance, risk) and a 95% worker retention rate.</span>
              <span aria-hidden="true">Illustration</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </Section>
  );
}
