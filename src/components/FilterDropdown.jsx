import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

/**
 * Custom filter dropdown (replaces a native <select>): a button that opens a floating
 * listbox panel with a check on the selected option.
 * Keyboard (WAI-ARIA listbox): ↓ / ↑ / Enter / Space open it; ↓ ↑ Home End move;
 * Enter / Space pick; Esc closes and returns focus; Tab closes; typing jumps to a match.
 *
 * placeholder: the "all" label (value ""), e.g. "All Job Category".
 */
export default function FilterDropdown({ value, onChange, placeholder, options, className = "" }) {
  const uid = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrap = useRef(null);
  const btn = useRef(null);
  const list = useRef(null);
  const typed = useRef({ text: "", t: 0 });

  const items = [{ value: "", label: placeholder }, ...options.map((o) => ({ value: o, label: o }))];
  const selected = Math.max(0, items.findIndex((i) => i.value === value));
  const optId = (i) => `${uid}-opt-${i}`;

  const openList = (at = selected) => {
    setActive(at);
    setOpen(true);
  };
  const close = (refocus = true) => {
    setOpen(false);
    if (refocus) btn.current?.focus();
  };
  const pick = (i) => {
    onChange(items[i].value);
    close();
  };

  // Focus the list when it opens; close on an outside click
  useEffect(() => {
    if (!open) return;
    list.current?.focus();
    const away = (e) => !wrap.current?.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", away);
    return () => document.removeEventListener("mousedown", away);
  }, [open]);

  // Keep the active option in view
  useEffect(() => {
    if (open) document.getElementById(optId(active))?.scrollIntoView({ block: "nearest" });
  }, [open, active]); // eslint-disable-line react-hooks/exhaustive-deps

  const onButtonKey = (e) => {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      openList(e.key === "ArrowUp" ? items.length - 1 : selected);
    }
  };

  const onListKey = (e) => {
    const last = items.length - 1;
    if (e.key === "ArrowDown") setActive((a) => Math.min(last, a + 1));
    else if (e.key === "ArrowUp") setActive((a) => Math.max(0, a - 1));
    else if (e.key === "Home") setActive(0);
    else if (e.key === "End") setActive(last);
    else if (e.key === "Enter" || e.key === " ") pick(active);
    else if (e.key === "Escape") close();
    else if (e.key === "Tab") return setOpen(false);
    else if (e.key.length === 1) {
      // Type-ahead: jump to the first option starting with what was typed
      const now = Date.now();
      typed.current.text = (now - typed.current.t > 600 ? "" : typed.current.text) + e.key.toLowerCase();
      typed.current.t = now;
      const hit = items.findIndex((i) => i.label.toLowerCase().startsWith(typed.current.text));
      if (hit >= 0) setActive(hit);
    } else return;
    e.preventDefault();
  };

  const on = !!value;
  return (
    <div ref={wrap} className={`relative ${className}`}>
      <button
        ref={btn}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${uid}-list`}
        aria-label={`${placeholder}: ${on ? value : "any"}`}
        onClick={() => (open ? close() : openList())}
        onKeyDown={onButtonKey}
        className={`flex h-12 w-full items-center justify-between gap-2 rounded-xl border bg-white pl-4 pr-3 text-left text-sm font-medium outline-none transition focus-visible:border-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-700/50 ${
          open ? "border-emerald-700 ring-2 ring-emerald-700/50" : on ? "border-emerald-700 text-slate-900" : "border-slate-500 text-slate-700 hover:border-slate-600"
        }`}
      >
        <span className="truncate">
          {on ? value : placeholder}
        </span>
        <ChevronDown className={`size-4 shrink-0 text-slate-600 transition-transform duration-300 ${open ? "rotate-180 text-emerald-700" : ""}`} aria-hidden />
      </button>

      {open && (
        <ul
          ref={list}
          id={`${uid}-list`}
          role="listbox"
          tabIndex={-1}
          aria-label={placeholder}
          aria-activedescendant={optId(active)}
          onKeyDown={onListKey}
          data-lenis-prevent
          className="absolute inset-x-0 top-full z-30 mt-2 max-h-72 min-w-[13rem] origin-top overflow-y-auto rounded-2xl border border-slate-200/80 bg-white p-2 shadow-xl shadow-slate-900/10 outline-none motion-safe:animate-[pop_0.18s_cubic-bezier(0.2,0.7,0.2,1)]"
        >
          {items.map((it, i) => {
            const isSel = i === selected;
            return (
              <li
                key={it.label}
                id={optId(i)}
                role="option"
                aria-selected={isSel}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => e.preventDefault() /* keep focus on the list */}
                onClick={() => pick(i)}
                className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  i === active ? "bg-slate-100 text-slate-900" : "text-slate-600"
                } ${isSel ? "font-semibold text-slate-900" : ""} ${i === 0 ? "mb-1 border-b border-slate-100 pb-3" : ""}`}
              >
                <span className="truncate">{it.label}</span>
                <Check className={`size-4 shrink-0 text-emerald-700 transition-opacity ${isSel ? "opacity-100" : "opacity-0"}`} aria-hidden />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
