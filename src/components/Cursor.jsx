import { useEffect, useRef } from "react";

const INTERACTIVE = "a, button, [role='tab'], select, input, textarea, label";

/**
 * Soft follower dot that trails the mouse and grows over links and buttons.
 * Desktop mouse only; the system cursor stays visible. The rAF loop runs only
 * while the dot is catching up, so it costs nothing when the mouse is still.
 */
export default function Cursor() {
  const ref = useRef(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const el = ref.current;
    const ease = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : 0.2;
    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;
    let raf = 0;
    let visible = false;

    const tick = () => {
      x += (tx - x) * ease;
      y += (ty - y) * ease;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.1 ? requestAnimationFrame(tick) : 0;
    };

    const move = (e) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!visible) {
        visible = true;
        x = tx;
        y = ty;
        el.dataset.visible = "true";
      }
      el.dataset.big = String(!!e.target.closest?.(INTERACTIVE));
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const hide = () => {
      visible = false;
      el.dataset.visible = "false";
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", hide);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", hide);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      data-visible="false"
      className="pointer-events-none fixed left-0 top-0 z-[70] hidden opacity-0 transition-opacity duration-300 data-[visible=true]:opacity-100 [@media(hover:hover)_and_(pointer:fine)]:block"
    >
      <span className="block size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-400/50 transition-[scale,background-color] duration-300 ease-out [[data-big=true]_&]:scale-[2.75] [[data-big=true]_&]:bg-emerald-400/25" />
    </div>
  );
}
