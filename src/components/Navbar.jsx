import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import Logo from "./Logo.jsx";
import { NAV } from "../content.js";

/** Desktop dropdown — opens on hover and on click/keyboard; closes on Escape or outside click. */
function Dropdown({ item, onPick, alignRight = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (e.type === "keydown" && e.key !== "Escape") return;
      if (e.type === "mousedown" && ref.current?.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  return (
    <li ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className="link-underline flex items-center gap-1 text-sm font-medium text-slate-300 transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none"
      >
        {item.label}
        <ChevronDown className={`size-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {/* pt-3 bridges the hover gap between trigger and panel */}
      <div
        className={`absolute top-full z-50 pt-3 transition-all duration-200 ${
          alignRight ? "right-0" : "left-1/2 -translate-x-1/2" /* last menu hugs the right edge so it never overflows */
        } ${
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
        }`}
      >
        <ul className="min-w-52 rounded-2xl border border-slate-800/80 bg-slate-900/90 p-1.5 shadow-2xl shadow-black/40 backdrop-blur-xl">
          {item.children.map((c) => (
            <li key={c.label}>
              <a
                href={c.href}
                onClick={() => {
                  onPick(c);
                  setOpen(false);
                }}
                className="group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white focus-visible:bg-white/5 focus-visible:outline-none"
              >
                {c.label}
                <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export default function Navbar({ onIntent }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState(null);

  // Deepen the glass once the page scrolls under the bar
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile sheet is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const pick = (link) => {
    if (link.intent) onIntent(link.intent);
    setMobileOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
        scrolled ? "border-slate-800/80 bg-obsidian/75 backdrop-blur-xl" : "border-transparent bg-obsidian"
      }`}
    >
      <nav aria-label="Primary" className="mx-auto flex h-20 max-w-[1280px] items-center justify-between gap-6 px-5 sm:px-8">
        <Logo />

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 xl:flex">
          {NAV.map((item, i) =>
            item.children ? (
              <Dropdown key={item.label} item={item} onPick={pick} alignRight={i === NAV.length - 1} />
            ) : (
              <li key={item.label}>
                <a
                  href={item.href}
                  data-active={item.label === "Home"}
                  className="link-underline text-sm font-medium text-slate-300 transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none data-[active=true]:text-white"
                >
                  {item.label}
                </a>
              </li>
            )
          )}
        </ul>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="grid size-11 place-items-center rounded-full border border-slate-700 text-white xl:hidden"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {/* Mobile / tablet sheet */}
      <div
        id="mobile-menu"
        className={`overflow-y-auto border-t border-slate-800/80 bg-obsidian transition-[max-height] duration-300 xl:hidden ${
          mobileOpen ? "max-h-[calc(100dvh-5rem)]" : "max-h-0 border-transparent"
        }`}
      >
        <ul className="px-5 py-4 sm:px-8">
          {NAV.map((item) => (
            <li key={item.label} className="border-b border-slate-800/60">
              {item.children ? (
                <>
                  <button
                    type="button"
                    aria-expanded={expanded === item.label}
                    onClick={() => setExpanded((v) => (v === item.label ? null : item.label))}
                    className="flex w-full items-center justify-between py-4 text-base font-medium text-slate-200"
                  >
                    {item.label}
                    <ChevronDown className={`size-4 transition-transform ${expanded === item.label ? "rotate-180" : ""}`} />
                  </button>
                  {expanded === item.label && (
                    <ul className="pb-3 pl-3">
                      {item.children.map((c) => (
                        <li key={c.label}>
                          <a href={c.href} onClick={() => pick(c)} className="block py-2.5 text-sm text-slate-400 hover:text-white">
                            {c.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <a href={item.href} onClick={() => pick(item)} className="block py-4 text-base font-medium text-slate-200">
                  {item.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
