import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

let lenis = null;
/** The active Lenis instance (null under reduced motion), e.g. to stop scrolling while a menu is open. */
export const getLenis = () => lenis;

/**
 * Weighted smooth scrolling (Lenis) driven by GSAP's ticker so ScrollTrigger
 * animations stay in sync. Touch devices keep native scrolling (Lenis default).
 * Skipped entirely for reduced motion.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Anchor links (#contact, #inquiry…) land below the sticky navbar
    lenis = new Lenis({ lerp: 0.1, anchors: { offset: -96 } });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Fonts and images shift layout after first paint; re-measure triggers once loaded
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);

    return () => {
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenis = null;
    };
  }, []);
}

export { gsap, ScrollTrigger };
