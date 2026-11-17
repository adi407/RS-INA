import { ArrowRight, ArrowUpRight, ConciergeBell, HardHat, Sprout, TrainFront } from "lucide-react";
import { Section, SectionHeader } from "./ui.jsx";
import { SECTORS, SECTORS_COPY } from "../content.js";

const ICONS = { hospitality: ConciergeBell, railway: TrainFront, agriculture: Sprout, construction: HardHat };

/** White bento card: inset photo (zooms on hover), icon, title and "Explore Talent". */
function SectorCard({ sector, index, onHire }) {
  const Icon = ICONS[sector.id];
  return (
    <a
      href="#inquiry"
      onClick={() => onHire(sector.id)}
      aria-label={`Explore ${sector.title.toLowerCase()} talent`}
      className="group flex flex-col rounded-3xl border border-slate-200/80 bg-white p-3 shadow-xl shadow-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
    >
      {/* 4:3 crop framed on the upper-middle of the photo: the source images carry a red
          overlay baked into their lower ~40% (from the old site), which this keeps out of view */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">
        <img
          src={sector.image}
          alt=""
          loading="lazy"
          className="size-full object-cover object-[center_25%] transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 font-display text-xs font-semibold text-slate-900 shadow-sm backdrop-blur">
          0{index + 1}
        </span>
        <span className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/90 text-slate-900 shadow-sm backdrop-blur transition-colors duration-300 group-hover:bg-emerald-600 group-hover:text-white">
          <ArrowUpRight className="size-4" aria-hidden />
        </span>
      </div>

      <div className="flex items-center gap-3 px-3 pb-3 pt-5">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-100">
          <Icon className="size-5" strokeWidth={1.6} aria-hidden />
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-xl font-semibold uppercase tracking-tight text-slate-900">{sector.title}</h3>
          <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
            Explore Talent
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
          </span>
        </div>
      </div>
    </a>
  );
}

/** Section 2 — industry sectors bento grid (white canvas). */
export default function Sectors({ onHire }) {
  return (
    <Section id="sectors" labelledBy="sectors-title">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeader id="sectors-title" tag={SECTORS_COPY.tag} title={SECTORS_COPY.headline} />
        <a
          href="#inquiry"
          onClick={() => onHire("hospitality")}
          className="group inline-flex items-center gap-2 self-start font-semibold text-emerald-600 transition-colors hover:text-emerald-500 lg:self-auto"
        >
          {SECTORS_COPY.subtitle}
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
        </a>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {SECTORS.map((s, i) => (
          <SectorCard key={s.id} sector={s} index={i} onHire={onHire} />
        ))}
      </div>
    </Section>
  );
}
