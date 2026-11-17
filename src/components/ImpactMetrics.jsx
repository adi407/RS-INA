import { Briefcase, Clock, ShieldCheck, Users } from "lucide-react";
import useCountUp from "../useCountUp.js";
import { CARD, ICON_TILE, Section, SectionHeader } from "./ui.jsx";
import { IMPACT } from "../content.js";

const ICONS = { projects: Briefcase, recruitment: Users, retention: ShieldCheck, support: Clock };

/** White stat card — the emerald value counts up when it scrolls into view. */
function MetricCard({ id, value, suffix, label }) {
  const [ref, n] = useCountUp(value);
  const Icon = ICONS[id];
  return (
    <div ref={ref} className={`${CARD} group flex flex-col items-center text-center`}>
      <span className={`${ICON_TILE} order-1 transition-colors duration-300 group-hover:bg-emerald-600 group-hover:text-white`}>
        <Icon className="size-[22px]" strokeWidth={1.5} aria-hidden />
      </span>
      {/* dt precedes dd in the DOM (valid <dl>); CSS order shows the value above the label */}
      <dt className="order-3 text-sm font-medium text-slate-600">{label}</dt>
      <dd className="order-2 mb-2 mt-6 font-display text-4xl font-extrabold tracking-tight text-emerald-600 tabular-nums lg:text-5xl">
        {n.toLocaleString("en-IN")}
        {suffix}
      </dd>
    </div>
  );
}

/** Section 8 — proven impact metrics on white. */
export default function ImpactMetrics() {
  return (
    <Section id="impact" labelledBy="impact-title">
      <SectionHeader id="impact-title" tag={IMPACT.tag} title={IMPACT.headline} align="center" />
      <dl className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {IMPACT.metrics.map((m) => (
          <MetricCard key={m.id} {...m} />
        ))}
      </dl>
    </Section>
  );
}
