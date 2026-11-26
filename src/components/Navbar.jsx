import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import Logo from "./Logo.jsx";
import { NAV } from "../content.js";
import { PATH, isHome, linkTo } from "../routes.js";

const OPEN_DELAY = 120;
const CLOSE_DELAY = 280;

/**
 * Desktop dropdown. Opens on hover (with a short delay so it doesn't flicker when the
 * pointer cuts a corner) and on click / Enter / Space. Closes on Esc (focus returns to
 * the button), outside click, or when focus leaves the menu.
 */
function Dropdown({ item, alignRight = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const button = useRef(null);
  const timer = useRef(0);

  const later = (v, ms) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(v), ms);
  };
  useEffect(() => () => clearTimeout(timer.current), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      button.current?.focus();
    };
    const onDown = (e) => !ref.current?.contains(e.target) && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  return (
    <li
      ref={ref}
      className="relative"
      onMouseEnter={() => later(true, OPEN_DELAY)}
      onMouseLeave={() => later(false, CLOSE_DELAY)}
      onBlur={(e) => !ref.current?.contains(e.relatedTarget) && setOpen(false)}
    >
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        onClick={() => {
          clearTimeout(timer.current);
          setOpen((v) => !v);
        }}
        data-active={item.children.some((c) => c.href === PATH)}
        className="link-underline flex min-h-11 items-center gap-1 text-sm font-medium text-slate-200 transition-colors hover:text-white data-[active=true]:text-white"
      >
        {item.label}
        <ChevronDown className={`size-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>

      <div
        className={`absolute top-full z-50 pt-2 transition-all duration-200 ${alignRight ? "right-0" : "left-1/2 -translate-x-1/2"} ${
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
        }`}
      >
        <ul className="min-w-56 rounded-2xl border border-slate-700 bg-slate-900/95 p-1.5 shadow-2xl shadow-black/40 backdrop-blur-xl">
          {item.children.map((c) => (
            <li key={c.label}>
              <a
                href={linkTo(c.href)}
                aria-current={c.href === PATH ? "page" : undefined}
                className="group flex min-h-11 items-center justify-between rounded-xl px-3.5 text-sm text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
              >
                {c.label}
                <ArrowUpRight className="size-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

/** Hamburger that morphs into an X. */
function MenuIcon({ open }) {
  const bar = "absolute left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-current transition-all duration-300";
  return (
    <span aria-hidden className="relative block size-5">
      <span className={`${bar} ${open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-1"}`} />
      <span className={`${bar} top-1/2 -translate-y-1/2 ${open ? "scale-x-0 opacity-0" : ""}`} />
      <span className={`${bar} ${open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-1"}`} />
    </span>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const toggle = useRef(null);
  const sheet = useRef(null);
  const header = useRef(null);

  // Deepen the glass and tighten the bar once the page scrolls under it
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobile sheet behaves like a dialog: scroll lock, Esc closes, Tab stays inside, focus returns
  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        toggle.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      const items = [toggle.current, ...sheet.current.querySelectorAll("a[href], button")];
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    // A tap anywhere outside the header closes the sheet
    const onDown = (e) => !header.current?.contains(e.target) && setMobileOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [mobileOpen]);

  // Widening to desktop shows the full links, so close the mobile sheet
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e) => e.matches && setMobileOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const close = () => setMobileOpen(false);

  return (
    <header
      ref={header}
      className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
        scrolled || mobileOpen ? "border-slate-800/80 bg-obsidian/90 backdrop-blur-xl" : "border-transparent bg-transparent"
      }`}
    >
      <nav aria-label="Primary" className="mx-auto flex h-20 max-w-[1280px] items-center justify-between gap-6 px-5 sm:px-8">
        <span className={`origin-left transition-transform duration-300 ${scrolled ? "scale-[0.88]" : ""}`}>
          <Logo />
        </span>

        {/* Desktop links — always visible from lg (1024px) up, scrolled or not */}
        <ul className="hidden items-center gap-6 lg:flex xl:gap-7">
          {NAV.map((item, i) =>
            item.children ? (
              <Dropdown key={item.label} item={item} alignRight={i === NAV.length - 1} />
            ) : (
              <li key={item.label}>
                <a
                  href={linkTo(item.href)}
                  data-active={(item.label === "Home" && isHome) || item.href === PATH}
                  aria-current={(item.label === "Home" && isHome) || item.href === PATH ? "page" : undefined}
                  className="link-underline inline-flex min-h-11 items-center text-sm font-medium text-slate-200 transition-colors hover:text-white data-[active=true]:text-white"
                >
                  {item.label}
                </a>
              </li>
            )
          )}
        </ul>

        <div className="flex items-center justify-end gap-4">
          <a
            href="/contact"
            className="hidden min-h-11 items-center rounded-full bg-emerald-700 px-5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 sm:inline-flex"
          >
            Contact Us
          </a>
          {/* Mobile / tablet only */}
          <button
            ref={toggle}
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="grid size-11 place-items-center rounded-full border border-slate-600 text-white transition-colors hover:border-emerald-400 lg:hidden"
          >
            <MenuIcon open={mobileOpen} />
          </button>
        </div>
      </nav>

      {/* Mobile / tablet sheet — inert (out of the tab order) while closed */}
      <div
        ref={sheet}
        id="mobile-menu"
        inert={mobileOpen ? undefined : ""}
        className={`overflow-y-auto overscroll-contain border-t bg-obsidian transition-[max-height] duration-300 lg:hidden ${
          mobileOpen ? "max-h-[calc(100dvh-5rem)] border-slate-800/80 shadow-[0_0_0_100vmax_rgba(2,6,23,0.55)]" : "max-h-0 border-transparent"
        }`}
      >
        <ul className="mx-auto max-w-[1280px] px-5 py-4 sm:px-8">
          {NAV.map((item, i) => (
            <li
              key={item.label}
              className={`border-b border-slate-800/60 transition-all duration-300 ${mobileOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}`}
              style={{ transitionDelay: mobileOpen ? `${i * 30}ms` : "0ms" }}
            >
              {item.children ? (
                <>
                  <button
                    type="button"
                    aria-expanded={expanded === item.label}
                    onClick={() => setExpanded((v) => (v === item.label ? null : item.label))}
                    className="flex min-h-14 w-full items-center justify-between text-base font-medium text-slate-100"
                  >
                    {item.label}
                    <ChevronDown className={`size-4 transition-transform ${expanded === item.label ? "rotate-180" : ""}`} aria-hidden />
                  </button>
                  {expanded === item.label && (
                    <ul className="pb-3 pl-3">
                      {item.children.map((c) => (
                        <li key={c.label}>
                          <a
                            href={linkTo(c.href)}
                            onClick={close}
                            aria-current={c.href === PATH ? "page" : undefined}
                            className="flex min-h-11 items-center text-sm text-slate-300 hover:text-white"
                          >
                            {c.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <a
                  href={linkTo(item.href)}
                  onClick={close}
                  aria-current={item.href === PATH ? "page" : undefined}
                  className="flex min-h-14 items-center text-base font-medium text-slate-100"
                >
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
