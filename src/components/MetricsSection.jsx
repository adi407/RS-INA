import { Briefcase, Clock, ShieldCheck, Users } from "lucide-react";
import { SectionHeader } from "./ui.jsx";
import useCountUp from "../useCountUp.js";
import { IMPACT } from "../content.js";

const ICONS = { projects: Briefcase, recruitment: Users, retention: ShieldCheck, support: Clock };

/** White metric card; the emerald number counts up when it scrolls into view. */
function Metric({ id, value, suffix, label, index }) {
  const [ref, n] = useCountUp(value);
  const Icon = ICONS[id];
  return (
    <div
      ref={ref}
      data-reveal
      style={{ "--d": `${index * 90}ms` }}
      className="group flex flex-col items-center rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-lg shadow-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50"
    >
      <span className="order-1 grid size-12 place-items-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100 transition-colors duration-300 group-hover:bg-emerald-600 group-hover:text-white">
        <Icon className="size-[22px]" strokeWidth={1.5} aria-hidden />
      </span>
      {/* dt precedes dd in the DOM (valid <dl>); CSS order shows the value above the label */}
      <dt className="order-3 text-sm font-semibold text-slate-900">{label}</dt>
      <dd className="order-2 mb-2 mt-6 font-display text-4xl font-extrabold tracking-tight text-emerald-600 tabular-nums lg:text-5xl">
        {n.toLocaleString("en-IN")}
        {suffix}
      </dd>
    </div>
  );
}

/** "Successful Recruitment 2022-2023" — four white stat cards, used on the inner pages. */
export default function MetricsSection({ className = "" }) {
  return (
    <section id="impact" aria-labelledby="impact-title" className={`scroll-mt-20 px-6 py-16 lg:px-12 lg:py-24 ${className}`}>
      <div className="mx-auto max-w-7xl">
        <SectionHeader id="impact-title" tag={IMPACT.tag} title={IMPACT.headline} split={IMPACT.headlineSplit} align="center" />
        <dl className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {IMPACT.metrics.map((m, i) => (
            <Metric key={m.id} {...m} index={i} />
          ))}
        </dl>
      </div>
    </section>
  );
}
