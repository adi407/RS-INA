import { useEffect, useRef } from "react";
import { getLenis } from "./motion.js";

/**
 * Accessible dialog behaviour shared by the shortlist modal and the job drawer:
 * moves focus inside on open and keeps Tab within it, closes on Escape, locks page
 * scroll (native + Lenis), and returns focus to whatever opened it.
 * Returns a ref to attach to the dialog element.
 */
export default function useDialog(open, onClose) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const returnTo = document.activeElement;
    document.body.style.overflow = "hidden";
    getLenis()?.stop();
    const t = setTimeout(() => ref.current?.querySelector("input, select, textarea, button")?.focus(), 50);

    const onKey = (e) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab" || !ref.current) return;
      const f = [...ref.current.querySelectorAll("button, input, select, textarea, a[href], [tabindex]")].filter(
        (el) => !el.disabled && el.tabIndex >= 0 && el.getClientRects().length > 0
      );
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      getLenis()?.start();
      returnTo?.focus?.();
    };
  }, [open, onClose]);

  return ref;
}
