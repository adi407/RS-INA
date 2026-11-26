import { ChevronRight } from "lucide-react";
import { BlurGroup, Words } from "./ui.jsx";

/**
 * Dark inner-page banner. Sits under the transparent navbar (-mt-20) like the homepage
 * hero; the photo is dimmed behind a left-to-right gradient so the copy stays legible.
 */
export default function PageBanner({ crumb, tag, title, subtitle, image }) {
  return (
    <section id="top" className="vt-banner relative isolate -mt-20 overflow-hidden bg-[#0A0F1D] shadow-[0_-2px_0_0_#0A0F1D]">
      <div aria-hidden className="absolute inset-0 -z-10">
        <img src={image} alt="" fetchPriority="high" className="size-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0F1D]/90 via-[#0A0F1D]/60 to-[#0A0F1D]/30" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0A0F1D] to-transparent" />
      </div>
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-40 md:px-12 lg:pb-24 lg:pt-48">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-slate-300">
          <a href="/" className="transition-colors hover:text-white">
            Home
          </a>
          <ChevronRight className="size-3.5" aria-hidden />
          <span className="text-slate-200" aria-current="page">
            {crumb}
          </span>
        </nav>
        <BlurGroup className="mt-8 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
            <Words text={tag} />
          </p>
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            <Words text={title} />
          </h1>
          {subtitle && (
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">
              <Words text={subtitle} />
            </p>
          )}
        </BlurGroup>
      </div>
    </section>
  );
}
