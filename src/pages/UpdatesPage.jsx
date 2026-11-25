import { BadgeCheck, MapPin } from "lucide-react";
import PageBanner from "../components/PageBanner.jsx";
import MetricsSection from "../components/MetricsSection.jsx";
import NewsStories from "../components/NewsStories.jsx";
import { UPDATES_PAGE } from "../content.js";

const LABEL_ICONS = { "zero-cost-recruitment": BadgeCheck, "physical-interviews": MapPin };

/**
 * /rs-updates — "RS Updates": banner, the company's news stories as wide alternating
 * bento cards (photos open full size), then the recruitment figures.
 */
export default function UpdatesPage() {
  return (
    <>
      <PageBanner crumb="RS Updates" tag={UPDATES_PAGE.tag} title={UPDATES_PAGE.title} image={UPDATES_PAGE.banner} />
      <section aria-label="Company news" className="scroll-mt-20 bg-[#F8FAFC] px-6 py-16 lg:px-12 lg:py-24">
        <NewsStories stories={UPDATES_PAGE.stories} icons={LABEL_ICONS} />
      </section>
      <MetricsSection className="bg-white" />
    </>
  );
}
