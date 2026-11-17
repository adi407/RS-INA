import { useState } from "react";
import { ArrowRight, BadgeCheck, Check, MessagesSquare, Search } from "lucide-react";
import { Section, SectionHeader } from "./ui.jsx";
import { WORKFLOW } from "../content.js";

const ICONS = { search: Search, consult: MessagesSquare, hire: BadgeCheck };

/** Desktop milestone rail: one dot centred over each card, joined by a dashed line. */
function MilestoneRail({ count, active }) {
  return (
    <div aria-hidden data-reveal className="relative mx-auto hidden max-w-6xl md:block">
      <span className="absolute left-[16.667%] right-[16.667%] top-1/2 -translate-y-1/2 border-t-2 border-dashed border-slate-300" />
      <div className="relative grid grid-cols-3 gap-8">
        {Array.from({ length: count }, (_, i) => (
          <span key={i} className="flex justify-center">
            <span
              className={`size-5 rounded-full border-2 transition-all duration-300 ${
                i === active
                  ? "border-emerald-600 bg-emerald-600 ring-[6px] ring-emerald-500/20"
                  : "border-slate-300 bg-[#F8FAFC] ring-0 ring-transparent"
              }`}
            />
          </span>
        ))}
      </div>
    </div>
  );
}

function StepCard({ step, index, active, onActivate }) {
  const Icon = ICONS[step.id];
  return (
    <li
      data-reveal
      style={{ "--d": `${index * 90}ms` }}
      onPointerEnter={(e) => e.pointerType === "mouse" && onActivate(index)}
      onPointerLeave={(e) => e.pointerType === "mouse" && onActivate(null)}
      onClick={() => onActivate(index)}
      className="h-full"
    >
      {/* The <li> is the fixed hover target; only this inner card lifts, so the lift can't drop the hover */}
      <div
        className={`h-full rounded-2xl border p-8 transition-all duration-300 ${
          active
            ? "-translate-y-1 border-emerald-600 bg-emerald-600 text-white shadow-xl shadow-emerald-950/20"
            : "border-slate-200/80 bg-white text-slate-900 shadow-lg shadow-slate-900/5"
        }`}
      >
      <div className="flex items-center gap-4">
        {/* Icon with a check badge (inverted on the featured card) */}
        <span className="relative shrink-0">
          <span
            className={`grid size-12 place-items-center rounded-2xl transition-colors duration-300 ${
              active ? "bg-white text-emerald-600" : "bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-100"
            }`}
          >
            <Icon className="size-5" strokeWidth={1.8} aria-hidden />
          </span>
          <span
            aria-hidden
            className={`absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full ring-2 transition-colors duration-300 ${
              active ? "bg-emerald-950 text-white ring-emerald-600" : "bg-emerald-500 text-white ring-white"
            }`}
          >
            <Check className="size-3" strokeWidth={3} />
          </span>
        </span>
        <span
          aria-hidden
          className={`font-display text-4xl font-extrabold leading-none tracking-tight transition-colors duration-300 ${active ? "text-white" : "text-slate-900"}`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <h3 className={`mt-7 font-display text-xl font-bold transition-colors duration-300 ${active ? "text-white" : "text-slate-900"}`}>
        <span className="sr-only">Step {index + 1}: </span>
        {step.title}
      </h3>
      <p className={`mt-3 text-base leading-relaxed transition-colors duration-300 ${active ? "text-emerald-50/90" : "text-slate-600"}`}>{step.body}</p>
      </div>
    </li>
  );
}

/**
 * Section 6 — horizontal milestone timeline (RemotePeople-style).
 * Cards rest white; the hovered card (or tapped, on touch) turns emerald and lights its milestone dot.
 */
export default function Workflow({ onContact }) {
  const { steps } = WORKFLOW;
  const [active, setActive] = useState(null);
  return (
    <Section id="workflow" tint labelledBy="workflow-title">
      <SectionHeader id="workflow-title" tag={WORKFLOW.tag} title={WORKFLOW.headline} split={WORKFLOW.headlineSplit} align="center" />

      <div className="mt-16">
        <MilestoneRail count={steps.length} active={active} />
        <ol className="relative mx-auto grid max-w-6xl grid-cols-1 gap-8 md:mt-10 md:grid-cols-3">
          {steps.map((s, i) => (
            <StepCard key={s.id} step={s} index={i} active={i === active} onActivate={setActive} />
          ))}
        </ol>
      </div>

      <div className="mt-14 flex justify-center">
        <a
          href="#inquiry"
          onClick={onContact}
          className="group inline-flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-4 font-semibold text-white shadow-lg shadow-emerald-950/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
        >
          {WORKFLOW.cta}
          <ArrowRight className="size-[18px] transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
        </a>
      </div>
    </Section>
  );
}
