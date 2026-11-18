import { BadgeCheck, LineChart, ShieldCheck, TrendingUp, Users } from "lucide-react";
import { CARD, ICON_TILE, LinePattern, Section, SectionHeader } from "./ui.jsx";
import { LICENSE, STRATEGIC } from "../content.js";

const ICONS = { efficiency: TrendingUp, license: ShieldCheck, research: Users, analytics: LineChart };

/** Renders body text verbatim, with the licence number set in emerald as a credential. */
function Body({ text }) {
  const i = text.indexOf(LICENSE);
  if (i === -1) return text;
  return (
    <>
      {text.slice(0, i)}
      <span className="font-semibold text-emerald-700 [overflow-wrap:anywhere] sm:whitespace-nowrap">{LICENSE}</span>
      {text.slice(i + LICENSE.length)}
    </>
  );
}

function AdvantageCard({ card, index }) {
  const Icon = ICONS[card.id];
  return (
    <article data-reveal style={{ "--d": `${index * 90}ms` }} className={`${CARD} group relative overflow-hidden lg:p-10`}>
      <div className="flex items-center justify-between">
        <span className={`${ICON_TILE} transition-colors duration-300 group-hover:bg-emerald-600 group-hover:text-white`}>
          <Icon className="size-[22px]" strokeWidth={1.5} aria-hidden />
        </span>
        {card.id === "license" ? (
          // Verified government licence badge
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 py-1 pl-2 pr-3 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-100">
            <BadgeCheck className="size-4 text-emerald-600" strokeWidth={2} aria-hidden />
            Verified · Govt. of India
          </span>
        ) : (
          <span aria-hidden className="font-display text-sm font-semibold tabular-nums text-slate-300 transition-colors group-hover:text-emerald-600">
            0{index + 1}
          </span>
        )}
      </div>
      <h3 className="mt-8 font-display text-xl font-semibold text-slate-900">{card.title}</h3>
      <p className="mt-3 text-base leading-relaxed text-slate-600">
        <Body text={card.body} />
      </p>
    </article>
  );
}

/** Section 7 — strategic advantage bento on slate-50. */
export default function StrategicAdvantage() {
  return (
    <Section id="about" tint labelledBy="strategic-title" className="relative isolate overflow-hidden">
      <LinePattern className="inset-x-0 top-0 h-[520px]" />
      <SectionHeader id="strategic-title" tag={STRATEGIC.tag} title={STRATEGIC.headline} split={STRATEGIC.headlineSplit} align="center" />
      <div className="focus-grid mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2">
        {STRATEGIC.cards.map((c, i) => (
          <AdvantageCard key={c.id} card={c} index={i} />
        ))}
      </div>
    </Section>
  );
}
