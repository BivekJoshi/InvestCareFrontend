"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

import Logo from "@/components/layout/Logo";
import Button from "@/components/ui/Button";
import { navLinks } from "@/data/navigation";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Exact match for the root, prefix match for everything else — but only on a
 * segment boundary, so `/invest` never lights up for a future `/investors`.
 */
function matches(href, pathname) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  /**
   * App Router navigations resolve on the server, so `pathname` only flips once
   * the new route commits — long enough on a heavy page to read as "the nav
   * isn't responding". Holding the clicked href moves the indicator on click
   * and hands control back to the real pathname the moment it lands.
   */
  const [pendingHref, setPendingHref] = useState(null);
  const activePath = pendingHref ?? pathname;
  const isActive = (href) => matches(href, activePath);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the drawer + drop the optimistic target once the route settles.
  useEffect(() => {
    setOpen(false);
    setPendingHref(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Every page opens on a dark forest hero, so the header sits inverted until
  // the visitor scrolls it onto the cream page body.
  const onDark = !scrolled && !open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        onDark
          ? "border-b border-transparent py-3"
          : "border-b border-forest-100 bg-cream/85 py-0 shadow-[0_1px_20px_-12px_rgba(5,26,17,0.35)] backdrop-blur-xl",
      )}
      style={{ minHeight: "var(--header-height)" }}
    >
      <nav
        className="container flex items-center justify-between gap-6"
        aria-label="Primary"
      >
        {/* White colourway over the dark hero, forest once scrolled. */}
        <Logo
          invert={onDark}
          priority
          className={cn(
            "transition-[height] duration-500",
            onDark ? "h-20 sm:h-24" : "h-14 sm:h-16",
          )}
        />

        <LayoutGroup id="primary-nav">
          <ul
            className={cn(
              "hidden items-center gap-1 rounded-full p-1 transition-colors duration-500 lg:flex",
              onDark
                ? "border border-white/10 bg-white/[0.06] backdrop-blur-md"
                : "border border-forest-100 bg-forest-50/70",
            )}
          >
            {navLinks.map((link) => {
              const active = isActive(link.href);

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setPendingHref(link.href)}
                    className={cn(
                      "relative block rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300",
                      onDark
                        ? active
                          ? "text-forest-950"
                          : "text-cream/70 hover:text-white"
                        : active
                          ? "text-cream"
                          : "text-forest-700 hover:text-forest-950",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {active ? (
                      <motion.span
                        layoutId="nav-pill"
                        initial={false}
                        className={cn(
                          "absolute inset-0 rounded-full transition-colors duration-500",
                          onDark
                            ? "bg-cream shadow-[0_6px_18px_-8px_rgba(0,0,0,0.6)]"
                            : "bg-forest-800 shadow-[0_6px_18px_-10px_rgba(5,26,17,0.9)]",
                        )}
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 34,
                        }}
                      >
                        {/* Gold cue rides along with the pill. */}
                        <span className="absolute inset-x-4 bottom-1 h-px rounded-full bg-gold-500" />
                      </motion.span>
                    ) : null}
                    {/* Sits above the pill — the pill itself must stay a
                        positioned sibling so the `<ul>` background can't
                        paint over it. */}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </LayoutGroup>

        <div className="flex items-center gap-3">
          <Button
            href="/invest"
            size="sm"
            variant={onDark ? "gold" : "primary"}
            className="hidden sm:inline-flex"
            withArrow
          >
            Invest With Us
          </Button>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full border transition lg:hidden",
              onDark
                ? "border-white/25 text-cream hover:bg-white/10"
                : "border-forest-200 text-forest-800 hover:bg-forest-50",
            )}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            className="lg:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <div className="container mb-4 mt-4 overflow-hidden rounded-2xl border border-forest-100 bg-white p-3 shadow-lift">
              <ul className="flex flex-col gap-1">
                {navLinks.map((link, i) => {
                  const active = isActive(link.href);

                  return (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.05 * i,
                        duration: 0.35,
                        ease: EASE,
                      }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setPendingHref(link.href)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "relative flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-colors",
                          active
                            ? "bg-forest-800 text-cream"
                            : "text-forest-700 hover:bg-forest-50",
                        )}
                      >
                        {active ? (
                          <span className="absolute inset-y-2 left-0 w-1 rounded-full bg-gold-500" />
                        ) : null}
                        {link.label}
                        {active ? (
                          <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
                        ) : null}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              <Button href="/invest" className="mt-3 w-full sm:hidden" withArrow>
                Invest With Us
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
