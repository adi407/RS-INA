import { useEffect, useRef, useState } from "react";
import { reducedMotion } from "./motion.js";

/**
 * Drives the illustrative mock-up animations:
 *  - plays once when the mock-up is mostly on screen (every device, so keyboard and
 *    touch users see it too)
 *  - with a mouse, hovering replays it: leaving resets, entering plays again
 *  - reduced motion: shows the finished state straight away
 * Returns [ref, on]: attach ref to the mock-up area, render the "done" state when on.
 */
export default function usePlayOnHover() {
  const ref = useRef(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion()) {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.intersectionRatio >= 0.6) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: [0.6] }
    );
    io.observe(el);

    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return () => io.disconnect();
    const enter = () => setOn(true);
    const leave = () => setOn(false);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    return () => {
      io.disconnect();
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  return [ref, on];
}

/** Delay for a step in the sequence when playing; instant reset when it stops. */
export const step = (on, ms) => ({ transitionDelay: on ? `${ms}ms` : "0ms" });
