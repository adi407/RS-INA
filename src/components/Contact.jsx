import { Globe2, Landmark } from "lucide-react";
import InquiryForm from "./InquiryForm.jsx";
import { Section } from "./ui.jsx";
import { ABOUT, LICENSE, REGIONS } from "../content.js";

/**
 * Section 9 — Contact (slate-50). Holds the inquiry form (#inquiry) every CTA links to,
 * plus the licence card and the regions served (#regions).
 */
export default function Contact(formProps) {
  return (
    <Section id="contact" tint labelledBy="contact-title">
      <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
        <div data-reveal className="lg:col-span-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">(11) Get In Touch</p>
          <h2 id="contact-title" className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl">
            Hiring a new talent can cost you time, energy, and money.{" "}
            <span className="text-emerald-600">Hire the best with RS International.</span>
          </h2>

          <div className="mt-10 flex gap-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-900/5">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-100">
              <Landmark className="size-5" strokeWidth={1.6} aria-hidden />
            </span>
            <p className="text-sm leading-relaxed text-slate-600">
              {ABOUT.approval}
              <span className="mt-1.5 block font-semibold text-slate-900 [overflow-wrap:anywhere]">License No: {LICENSE}</span>
            </p>
          </div>

          <div id="regions" className="mt-8 scroll-mt-28">
            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
              <Globe2 className="size-3.5 text-emerald-600" aria-hidden />
              Region we serve
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {REGIONS.map((r) => (
                <li key={r.id} className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-700">
                  {r.label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div data-reveal style={{ "--d": "120ms" }} className="lg:col-span-6">
          <InquiryForm {...formProps} />
        </div>
      </div>
    </Section>
  );
}
