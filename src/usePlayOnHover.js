import { useEffect, useRef, useState } from "react";

/**
 * Drives the product-mockup "demo" animations (1Centre-style):
 *  - mouse devices: plays while hovered, resets when the pointer leaves
 *  - touch devices: plays once when the mockup is mostly on screen
 *  - reduced motion: shows the finished state straight away
 * Returns [ref, on]: attach ref to the hover area, render the "done" state when on.
 */
export default function usePlayOnHover() {
  const ref = useRef(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOn(true);
      return;
    }
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      const enter = () => setOn(true);
      const leave = () => setOn(false);
      el.addEventListener("pointerenter", enter);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointerenter", enter);
        el.removeEventListener("pointerleave", leave);
      };
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
    return () => io.disconnect();
  }, []);

  return [ref, on];
}

/** Delay for a step in the sequence when playing; instant reset when it stops. */
export const step = (on, ms) => ({ transitionDelay: on ? `${ms}ms` : "0ms" });
