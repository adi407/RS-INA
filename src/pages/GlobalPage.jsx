import { Building2, Palmtree } from "lucide-react";
import PageBanner from "../components/PageBanner.jsx";
import MetricsSection from "../components/MetricsSection.jsx";
import NewsStories from "../components/NewsStories.jsx";
import { GLOBAL_PAGE } from "../content.js";

const LABEL_ICONS = { neom: Building2, "marsa-al-arab": Palmtree };

/**
 * /global — "Global Updates": banner, a short note that these are general industry
 * news (not R.S. International projects), the stories as wide alternating bento cards,
 * then the recruitment figures.
 */
export default function GlobalPage() {
  return (
    <>
      <PageBanner crumb="Global Updates" tag={GLOBAL_PAGE.tag} title={GLOBAL_PAGE.title} image={GLOBAL_PAGE.banner} />
      <section aria-label="Global news" className="scroll-mt-20 bg-[#F8FAFC] px-6 py-16 lg:px-12 lg:py-24">
        <p className="mx-auto mb-10 max-w-7xl text-center text-sm font-medium uppercase tracking-widest text-slate-500 lg:mb-12">
          {GLOBAL_PAGE.note}
        </p>
        <NewsStories stories={GLOBAL_PAGE.stories} icons={LABEL_ICONS} />
      </section>
      <MetricsSection className="bg-white" />
    </>
  );
}
