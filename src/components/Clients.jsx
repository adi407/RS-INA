import { Section, SectionHeader } from "./ui.jsx";
import { CLIENTS } from "../content.js";

/**
 * One partner card. The source logos are PNGs on white, which sit naturally on these
 * white cards: grayscale + dimmed by default, full colour on hover.
 */
function PartnerCard({ name, logo, index, className = "" }) {
  return (
    <li
      data-reveal
      style={{ "--d": `${index * 90}ms` }}
      className={`group flex h-32 items-center justify-center rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-900/5 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/40 ${className}`}
    >
      <img
        src={logo}
        alt={name}
        loading="lazy"
        className="max-h-16 w-auto max-w-full transition-transform duration-300 group-hover:scale-105"
      />
    </li>
  );
}

/** Section 6 — monochrome partner grid on white. */
export default function Clients() {
  return (
    <Section id="clients" labelledBy="clients-title">
      <SectionHeader id="clients-title" tag={CLIENTS.tag} title={CLIENTS.headline} split={CLIENTS.headlineSplit} subtitle={CLIENTS.subtitle} align="center" />
      <ul aria-label="Our clients" className="mx-auto mt-16 grid max-w-6xl grid-cols-2 gap-6 md:grid-cols-5">
        {CLIENTS.logos.map((c, i) => (
          // The odd fifth card spans both columns on mobile so the grid stays balanced
          <PartnerCard key={c.name} {...c} index={i} className={i === CLIENTS.logos.length - 1 ? "col-span-2 md:col-span-1" : ""} />
        ))}
      </ul>
    </Section>
  );
}
