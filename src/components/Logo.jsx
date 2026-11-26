import { isHome } from "../routes.js";

/**
 * RS International logo (the company's own artwork, /public/media/rs-logo.png).
 * Its navy text would disappear on the dark navbar/footer, so it sits on a small
 * white badge and shows exactly as designed. Source is 158×68px; it's displayed
 * at 44px tall (navbar) so it stays sharp. Ask the agency for an SVG for retina.
 */
export default function Logo({ size = "md" }) {
  const height = size === "lg" ? "h-14" : "h-9 sm:h-11";
  return (
    <a
      href={isHome ? "#top" : "/"}
      // justify-self/self-center: don't stretch to fill the navbar's grid column
      className="group inline-flex shrink-0 self-center justify-self-start rounded-xl bg-white px-3 py-1.5 shadow-sm ring-1 ring-white/10 transition-transform duration-300 hover:-translate-y-0.5"
      aria-label="RS International — home"
    >
      <img
        src="/media/rs-logo.png"
        alt="RS International — Human Resource & Manpower Consultant"
        width="158"
        height="68"
        className={`${height} w-auto`}
      />
    </a>
  );
}
