import {
  ArrowRight,
  BadgeCheck,
  Check,
  ClipboardCheck,
  FileCheck2,
  LayoutDashboard,
  Plane,
  ShieldCheck,
  Users,
} from "lucide-react";
import { BlurGroup, BTN_GHOST, BTN_PRIMARY, Section, Words } from "./ui.jsx";
import usePlayOnHover, { step } from "../usePlayOnHover.js";
import { LICENSE, PLATFORM } from "../content.js";


/* Mockup data: roles and pipeline stages only — no invented people or figures */
const STAGES = ["Sourcing", "Vetting", "Visa", "Deploy"];
const PIPELINE = [
  { role: "Site Engineer", sector: "Construction", status: "Visa issued", stage: 3 },
  { role: "Chef de Partie", sector: "Hospitality", status: "Medical cleared", stage: 2 },
  { role: "Rail Technician", sector: "Railway", status: "Skill test passed", stage: 1 },
];
const STATUS_TONE = ["", "bg-sky-50 text-sky-700", "bg-amber-50 text-amber-700", "bg-emerald-50 text-emerald-700"];

/* Two states stacked in one grid cell, cross-fading — keeps the badge from jumping */
const STACK = "grid justify-items-end [&>*]:col-start-1 [&>*]:row-start-1";
const FADE = "transition-all duration-500 ease-out";

/**
 * Platform dashboard mockup with a 1Centre-style demo: on hover (or once in view on touch)
 * "Mobilize" presses, each candidate resolves from "Checking…" to its result, the Visa stage
 * fills, then the "Visa approved" toast pops in. Leaving resets it.
 */
function DashboardMockup({ on }) {
  return (
    <figure className="relative">
      <figcaption className="absolute -bottom-12 right-0 text-xs font-medium text-slate-600">
        Illustration: how we track each candidate from sourcing to deployment
      </figcaption>

      <div
        aria-hidden
        className={`rounded-3xl border border-slate-200/80 bg-gradient-to-br from-amber-100/50 via-orange-50/30 to-emerald-50/30 p-3 shadow-2xl transition-all duration-500 ease-out ${
          on ? "-translate-y-1 scale-[1.01] shadow-slate-900/15" : "shadow-slate-900/10"
        }`}
      >
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
          {/* Window chrome */}
          <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
            <div className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-slate-200" />
              <span className="size-2.5 rounded-full bg-slate-200" />
              <span className="size-2.5 rounded-full bg-slate-200" />
            </div>
            <span className="font-display text-sm font-semibold text-slate-900">Candidate pipeline</span>
            {/* The "button" the demo presses */}
            <span
              className={`ml-auto flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold ring-1 ring-inset transition-all duration-300 ${
                on ? "scale-95 bg-slate-900 text-white ring-slate-900" : "bg-white text-slate-700 ring-slate-200"
              }`}
            >
              Mobilize <ArrowRight className="size-3" />
            </span>
          </div>

          <div className="flex">
            {/* Icon rail */}
            <div className="hidden flex-col items-center gap-2 border-r border-slate-100 px-2.5 py-4 sm:flex">
              {[LayoutDashboard, Users, FileCheck2, Plane, ShieldCheck].map((Icon, i) => (
                <span
                  key={i}
                  className={`grid size-9 place-items-center rounded-xl ${i === 0 ? "bg-emerald-700 text-white" : "text-slate-400"}`}
                >
                  <Icon className="size-4" strokeWidth={1.75} />
                </span>
              ))}
            </div>

            <div className="min-w-0 flex-1 space-y-4 p-4 sm:p-5">
              {/* Active requirement */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">Active requirement</p>
                    <p className="mt-1 truncate font-display text-[15px] font-semibold text-slate-900">
                      Construction · Middle East
                    </p>
                  </div>
                  <span className={STACK}>
                    <span
                      className={`${FADE} shrink-0 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-inset ring-slate-200 ${on ? "opacity-0" : "opacity-100"}`}
                      style={step(on, 900)}
                    >
                      Stage 2 of 4
                    </span>
                    <span
                      className={`${FADE} shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-100 ${on ? "opacity-100" : "opacity-0"}`}
                      style={step(on, 900)}
                    >
                      Stage 3 of 4
                    </span>
                  </span>
                </div>
                <ol className="mt-4 grid grid-cols-4 gap-1.5">
                  {STAGES.map((s, i) => {
                    // Sourcing + Vetting are done; Visa completes during the demo; Deploy stays ahead
                    const done = i < 2 || (i === 2 && on);
                    return (
                      <li key={s}>
                        <span className="block h-1.5 overflow-hidden rounded-full bg-slate-200">
                          <span
                            className="block h-full origin-left rounded-full bg-emerald-500 transition-transform duration-700 ease-out"
                            style={{ transform: `scaleX(${done ? 1 : 0})`, ...(i === 2 ? step(on, 900) : {}) }}
                          />
                        </span>
                        <span
                          className={`mt-1.5 block text-[11px] font-medium transition-colors duration-500 ${done ? "text-slate-700" : "text-slate-500"}`}
                          style={i === 2 ? step(on, 900) : undefined}
                        >
                          {s}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </div>

              {/* Candidate pipeline — each row resolves in turn */}
              <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-100">
                {PIPELINE.map((c, i) => {
                  const delay = 250 + i * 230;
                  return (
                    <li key={c.role} className="flex items-center gap-3 px-3.5 py-3">
                      <span className="grid size-8 shrink-0 [&>*]:col-start-1 [&>*]:row-start-1">
                        <span
                          className={`${FADE} grid size-8 place-items-center rounded-full bg-slate-100 text-slate-500 ${on ? "scale-75 opacity-0" : "opacity-100"}`}
                          style={step(on, delay)}
                        >
                          <Users className="size-3.5" strokeWidth={1.75} />
                        </span>
                        <span
                          className={`${FADE} grid size-8 place-items-center rounded-full bg-emerald-500 text-white ${on ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
                          style={step(on, delay)}
                        >
                          <Check className="size-4" strokeWidth={2.5} />
                        </span>
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold text-slate-900">{c.role}</p>
                        <p className="truncate text-[11px] text-slate-500">{c.sector}</p>
                      </div>
                      <span className={STACK}>
                        <span className={`${FADE} shrink-0 px-2.5 py-1 text-[11px] font-semibold ${on ? "opacity-0" : "opacity-100"}`} style={step(on, delay)}>
                          <span className="text-shimmer">Checking…</span>
                        </span>
                        <span
                          className={`${FADE} shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_TONE[c.stage]} ${
                            on ? "translate-x-0 opacity-100" : "translate-x-2 opacity-0"
                          }`}
                          style={step(on, delay)}
                        >
                          {c.status}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>

              {/* Compliance strip */}
              <div className="flex items-center gap-3 rounded-2xl bg-emerald-50/70 px-3.5 py-3 ring-1 ring-inset ring-emerald-100">
                <ShieldCheck className="size-4 shrink-0 text-emerald-700" strokeWidth={1.75} />
                <p className="min-w-0 truncate text-[12px] text-slate-600">
                  <span className="font-semibold text-slate-900">MEA licensed</span> · {LICENSE}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast that pops in at the end of the sequence */}
      <div
        aria-hidden
        className={`absolute -bottom-5 -left-4 hidden items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-xl shadow-slate-900/10 transition-all duration-500 ease-out sm:flex lg:-left-8 ${
          on ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-95 opacity-0"
        }`}
        style={step(on, 1250)}
      >
        <span className="grid size-8 place-items-center rounded-full bg-emerald-700 text-white">
          <BadgeCheck className="size-4" strokeWidth={2} />
        </span>
        <div>
          <p className="text-[13px] font-semibold text-slate-900">Visa approved</p>
          <p className="text-[11px] text-slate-500">Documentation verified</p>
        </div>
      </div>

      <div
        aria-hidden
        className="absolute -right-3 -top-4 hidden items-center gap-2 rounded-full border border-slate-200/80 bg-white px-3.5 py-2 text-[12px] font-semibold text-slate-700 shadow-lg shadow-slate-900/10 sm:flex lg:-right-6"
      >
        <ClipboardCheck className="size-3.5 text-emerald-700" strokeWidth={2} />
        Pre-screened
      </div>
    </figure>
  );
}

/** Section 3 — two-column platform feature (RemotePeople-style split). */
export default function Platform({ onConsult }) {
  const [demoRef, demoOn] = usePlayOnHover();
  return (
    <Section id="platform" labelledBy="platform-title">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div data-reveal className="lg:col-span-6">
          <BlurGroup>
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700"><Words text={PLATFORM.tag} /></p>
          <h2
            id="platform-title"
            className="mt-4 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl"
          >
            <Words text={PLATFORM.headlineLead} />{" "}
            <span className="underline decoration-emerald-500 decoration-[5px] underline-offset-[10px] [text-decoration-skip-ink:none]">
              <Words text={PLATFORM.headlineAccent} />
            </span>
          </h2>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-slate-600"><Words text={PLATFORM.subtitle} /></p>
          </BlurGroup>

          <ul className="mt-8 space-y-4">
            {PLATFORM.bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-[15px] font-medium text-slate-800">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-emerald-700 text-white">
                  <Check className="size-3" strokeWidth={3} aria-hidden />
                </span>
                {b}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a href="#inquiry" onClick={onConsult} className={BTN_PRIMARY}>
              {PLATFORM.primaryCta}
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
            </a>
            <a href="#sectors" className={BTN_GHOST}>
              {PLATFORM.secondaryCta}
            </a>
          </div>
        </div>

        <div ref={demoRef} data-reveal style={{ "--d": "120ms" }} className="lg:col-span-6">
          <DashboardMockup on={demoOn} />
        </div>
      </div>
    </Section>
  );
}
