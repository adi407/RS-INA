import { ArrowRight, BadgeCheck, MessagesSquare, Search } from "lucide-react";
import { BTN_PRIMARY, Section, SectionHeader } from "./ui.jsx";
import { WORKFLOW } from "../content.js";

const ICONS = { search: Search, consult: MessagesSquare, hire: BadgeCheck };

/** White step card with a large number that glows emerald on hover. */
function StepCard({ step, index, last }) {
  const Icon = ICONS[step.id];
  return (
    <li className="relative">
      <article className="group relative h-full overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.14),transparent_65%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
        <div className="relative flex items-start justify-between">
          <span
            aria-hidden
            className="font-display text-7xl font-extrabold leading-none tracking-tighter text-slate-200 transition-colors duration-300 group-hover:text-emerald-500 group-hover:[text-shadow:0_0_32px_rgba(16,185,129,0.35)]"
          >
            0{index + 1}
          </span>
          <span className="grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-100 transition-colors duration-300 group-hover:bg-emerald-600 group-hover:text-white">
            <Icon className="size-5" strokeWidth={1.7} aria-hidden />
          </span>
        </div>
        <h3 className="relative mt-10 font-display text-xl font-semibold text-slate-900">
          <span className="sr-only">Step {index + 1}: </span>
          {step.title}
        </h3>
        <p className="relative mt-3 text-base leading-relaxed text-slate-600">{step.body}</p>
      </article>

      {/* Connector arrow to the next step (desktop, sits in the grid gap) */}
      {!last && (
        <span
          aria-hidden
          className="absolute -right-[22px] top-1/2 z-10 hidden size-9 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white text-emerald-600 shadow-sm md:grid"
        >
          <ArrowRight className="size-4" />
        </span>
      )}
    </li>
  );
}

/** Section 5 — horizontal process timeline on slate-50. */
export default function Workflow({ onContact }) {
  const { steps } = WORKFLOW;
  return (
    <Section id="workflow" tint labelledBy="workflow-title">
      <SectionHeader id="workflow-title" tag={WORKFLOW.tag} title={WORKFLOW.headline} align="center" />
      <ol className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
        {steps.map((s, i) => (
          <StepCard key={s.id} step={s} index={i} last={i === steps.length - 1} />
        ))}
      </ol>
      <div className="mt-14 flex justify-center">
        <a href="#inquiry" onClick={onContact} className={BTN_PRIMARY}>
          {WORKFLOW.cta}
          <ArrowRight className="size-[18px] transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
        </a>
      </div>
    </Section>
  );
}
