import { ArrowRight, Briefcase, Building2, Mail } from "lucide-react";
import PageBanner from "../components/PageBanner.jsx";
import { BTN_PRIMARY } from "../components/ui.jsx";

const LINKS = [
  { href: "/jobs", icon: Briefcase, label: "Browse job openings" },
  { href: "/employers", icon: Building2, label: "Hire workers" },
  { href: "/contact", icon: Mail, label: "Contact us" },
];

/** Shown for any address that isn't a page on this site. */
export default function NotFoundPage() {
  return (
    <>
      <PageBanner crumb="Page not found" tag="Error 404" title="Page not found" subtitle="The page you were looking for has moved or doesn’t exist." image="/media/hero-cities-poster.jpg" />
      <section aria-label="Where to go next" className="bg-[#F8FAFC] px-6 py-16 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-2xl font-bold text-slate-900">Try one of these instead</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {LINKS.map(({ href, icon: Icon, label }) => (
              <li key={href}>
                <a href={href} className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-5 font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-600">
                  <Icon className="size-5 text-emerald-700" aria-hidden />
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <a href="/" className={`${BTN_PRIMARY} mt-10`}>
            Go to the home page
            <ArrowRight className="size-4" aria-hidden />
          </a>
        </div>
      </section>
    </>
  );
}
