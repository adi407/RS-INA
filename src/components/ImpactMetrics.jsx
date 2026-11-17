import { useEffect, useRef, useState } from "react";
import { Briefcase, Clock, ShieldCheck, Users } from "lucide-react";
import useCountUp from "../useCountUp.js";
import { CARD, ICON_TILE, Section, SectionHeader } from "./ui.jsx";
import { IMPACT } from "../content.js";
import { ScrollTrigger } from "../motion.js";

/* Dark-mode variants, active while the section carries data-dark="true" (group/theme) */
const DARK_CARD = "group-data-[dark=true]/theme:border-white/10 group-data-[dark=true]/theme:bg-white/[0.04] group-data-[dark=true]/theme:shadow-none";
const DARK_ICON = "group-data-[dark=true]/theme:bg-emerald-500/10 group-data-[dark=true]/theme:text-emerald-400 group-data-[dark=true]/theme:ring-emerald-500/20";

const ICONS = { projects: Briefcase, recruitment: Users, retention: ShieldCheck, support: Clock };

/** White stat card — the emerald value counts up when it scrolls into view. */
function MetricCard({ id, value, suffix, label, index }) {
  const [ref, n] = useCountUp(value);
  const Icon = ICONS[id];
  return (
    <div ref={ref} data-reveal style={{ "--d": `${index * 90}ms` }} className={`${CARD} ${DARK_CARD} group flex flex-col items-center text-center duration-700`}>
      <span className={`${ICON_TILE} ${DARK_ICON} order-1 transition-colors duration-300 group-hover:bg-emerald-600 group-hover:text-white`}>
        <Icon className="size-[22px]" strokeWidth={1.5} aria-hidden />
      </span>
      {/* dt precedes dd in the DOM (valid <dl>); CSS order shows the value above the label */}
      <dt className="order-3 text-sm font-medium text-slate-600 transition-colors duration-700 group-data-[dark=true]/theme:text-slate-400">{label}</dt>
      <dd className="order-2 mb-2 mt-6 font-display text-4xl font-extrabold tracking-tight text-emerald-600 tabular-nums transition-colors duration-700 group-data-[dark=true]/theme:text-emerald-400 lg:text-5xl">
        {n.toLocaleString("en-IN")}
        {suffix}
      </dd>
    </div>
  );
}

/**
 * Section 10 — proven impact metrics. Flips the page from light to dark while the
 * section holds the middle of the screen (nk.studio-style), then back on leaving.
 */
export default function ImpactMetrics() {
  const ref = useRef(null);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: "top 55%",
      end: "bottom 45%",
      onToggle: (self) => setDark(self.isActive),
    });
    return () => st.kill();
  }, []);

  return (
    <Section
      ref={ref}
      id="impact"
      labelledBy="impact-title"
      data-dark={dark}
      bg={dark ? "bg-[#0A0F1D]" : "bg-white"}
      className="group/theme relative isolate overflow-hidden transition-colors duration-700"
    >
      {/* Emerald glow that fades in with the dark state */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_55%_at_50%_100%,rgba(16,185,129,0.18),transparent)] opacity-0 transition-opacity duration-700 group-data-[dark=true]/theme:opacity-100"
      />
      <SectionHeader id="impact-title" tag={IMPACT.tag} title={IMPACT.headline} split={IMPACT.headlineSplit} align="center" />
      <dl className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {IMPACT.metrics.map((m, i) => (
          <MetricCard key={m.id} {...m} index={i} />
        ))}
      </dl>
    </Section>
  );
}
