import { ArrowRight, Briefcase, ChevronDown, Globe2 } from "lucide-react";
import useCountUp from "../useCountUp.js";
import { HERO, METRICS, REGIONS, SECTORS } from "../content.js";

/** One stat in the trust ribbon — counts up when it scrolls into view. */
function Metric({ value, suffix, label, index }) {
  const [ref, n] = useCountUp(value);
  return (
    <div ref={ref} className={`flex flex-col ${index > 0 ? "md:border-l md:border-white/10 md:pl-6" : ""}`}>
      {/* dt precedes dd in the DOM (valid <dl>); CSS order shows the value first */}
      <dt className="order-2 mt-1.5 text-sm leading-snug text-slate-400">{label}</dt>
      <dd className="order-1 font-display text-3xl font-bold tracking-tight text-white tabular-nums sm:text-4xl">
        {n.toLocaleString("en-IN")}
        <span className="text-emerald-400">{suffix}</span>
      </dd>
    </div>
  );
}

/** Labelled native select inside the white search pill (keyboard & screen-reader friendly). */
function PillSelect({ id, label, icon: Icon, value, onChange, options }) {
  return (
    <label
      htmlFor={id}
      className="relative flex flex-1 cursor-pointer items-center gap-3 rounded-2xl px-4 py-2.5 transition-colors hover:bg-slate-50 focus-within:bg-slate-50"
    >
      <Icon className="size-5 shrink-0 text-emerald-600" strokeWidth={1.7} aria-hidden />
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-semibold uppercase tracking-widest text-slate-500">{label}</span>
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full cursor-pointer appearance-none truncate bg-transparent pr-6 text-[15px] font-semibold text-slate-900 outline-none"
        >
          {options.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      </span>
      <ChevronDown className="pointer-events-none absolute right-4 size-4 text-slate-400" aria-hidden />
    </label>
  );
}

/**
 * Hero — dark anchor block: duotone offshore backdrop, editorial headline,
 * floating white search pill (its button is the "Free CV Search" CTA), trust ribbon.
 */
export default function Hero({ industry, setIndustry, region, setRegion, onSearch }) {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-[#0A0F1D]">
      {/* Backdrop: photo → grayscale → teal tint (duotone) → legibility gradients */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <img
          src={HERO.image}
          alt=""
          className="size-full object-cover object-[70%_center] grayscale contrast-125 brightness-[0.7]"
          fetchpriority="high"
        />
        <div className="absolute inset-0 bg-teal-950 mix-blend-color" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0F1D]/95 via-[#0A0F1D]/80 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0A0F1D] to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-16 pt-20 md:px-12 lg:pb-20 lg:pt-28">
        <h1 className="max-w-4xl font-display text-[40px] font-extrabold uppercase leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
          Recruit <span className="text-emerald-400">Top Talents</span> In Your Industry
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">{HERO.subtitle}</p>

        {/* Floating search pill */}
        <form
          role="search"
          aria-label="Search talent by industry and destination"
          onSubmit={(e) => {
            e.preventDefault();
            onSearch();
          }}
          className="mt-10 max-w-4xl rounded-3xl bg-white p-2 shadow-2xl shadow-black/40"
        >
          <div className="flex flex-col gap-1 md:flex-row md:items-center">
            <PillSelect
              id="hero-industry"
              label="Industry"
              icon={Briefcase}
              value={industry}
              onChange={setIndustry}
              options={SECTORS.map((s) => ({ id: s.id, label: s.title }))}
            />
            <span className="mx-1 hidden h-10 w-px bg-slate-200 md:block" aria-hidden />
            <PillSelect id="hero-region" label="Destination" icon={Globe2} value={region} onChange={setRegion} options={REGIONS} />
            <button
              type="submit"
              className="group mt-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-7 py-4 font-medium text-white shadow-lg shadow-emerald-950/10 transition-all duration-200 hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 md:mt-0"
            >
              {HERO.cta}
              <ArrowRight className="size-[18px] transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
            </button>
          </div>
        </form>

        {/* Verified trust ribbon */}
        <dl className="mt-14 grid grid-cols-2 gap-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md md:grid-cols-4">
          {METRICS.map((m, i) => (
            <Metric key={m.label} {...m} index={i} />
          ))}
        </dl>
      </div>
    </section>
  );
}
