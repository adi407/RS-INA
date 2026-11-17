import { ArrowRight, Check, FileCheck2, Landmark, ShieldCheck } from "lucide-react";
import useCountUp from "../useCountUp.js";
import { BTN_PRIMARY, Section } from "./ui.jsx";
import { LICENSE, SOLUTION } from "../content.js";

const ICONS = { vetting: FileCheck2, compliance: Landmark, risk: ShieldCheck };

/** White "assurance" card — verified compliance & speed proof points instead of a stock photo. */
function AssuranceCard() {
  const [ref, retention] = useCountUp(SOLUTION.retention, 1400);
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-900/5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-100">
            <ShieldCheck className="size-5" strokeWidth={1.6} aria-hidden />
          </span>
          <div>
            <p className="font-display text-sm font-semibold text-slate-900">RS Assurance</p>
            <p className="text-xs text-slate-500 [overflow-wrap:anywhere]">Lic. {LICENSE}</p>
          </div>
        </div>
        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
          <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden />
          Active
        </span>
      </div>

      <ul className="divide-y divide-slate-100">
        {SOLUTION.assurances.map((a) => {
          const Icon = ICONS[a.id];
          return (
            <li key={a.id} className="flex gap-4 py-5">
              <Icon className="mt-0.5 size-5 shrink-0 text-slate-400" strokeWidth={1.6} aria-hidden />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-slate-900">{a.title}</p>
                  <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                    <Check className="size-3.5" strokeWidth={2.5} aria-hidden />
                    {a.status}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{a.body}</p>
              </div>
            </li>
          );
        })}
      </ul>

      <div ref={ref} className="rounded-2xl bg-slate-50 p-4">
        <div className="flex items-baseline justify-between">
          <p className="text-sm text-slate-600">Worker Retention Rate</p>
          <p className="font-display text-2xl font-bold tabular-nums text-slate-900">
            {retention}
            <span className="text-emerald-600">%</span>
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
          <div className="h-full rounded-full bg-emerald-500 transition-[width] duration-300" style={{ width: `${retention}%` }} />
        </div>
        <p className="mt-2 text-xs text-slate-500">Successful Recruitment 2022–2023</p>
      </div>
    </div>
  );
}

/** Section 4 — executive featured banner on white. */
export default function Solution({ onSearch }) {
  return (
    <Section id="solution" labelledBy="solution-title">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-50 via-white to-emerald-50/60 p-8 shadow-xl shadow-slate-900/5 lg:p-14">
        {/* Soft dot grid, fading toward the copy */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(15,23,42,0.07)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_65%)]"
        />
        <div className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">{SOLUTION.tag}</p>
            <h2 id="solution-title" className="mt-4 max-w-xl font-display text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl">
              {SOLUTION.headline}
            </h2>
            <p className="mb-8 mt-4 max-w-lg text-lg leading-relaxed text-slate-600">{SOLUTION.subtitle}</p>
            <a href="#inquiry" onClick={onSearch} className={BTN_PRIMARY}>
              {SOLUTION.cta}
              <ArrowRight className="size-[18px] transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
            </a>
          </div>
          <div className="lg:col-span-5">
            <AssuranceCard />
          </div>
        </div>
      </div>
    </Section>
  );
}
