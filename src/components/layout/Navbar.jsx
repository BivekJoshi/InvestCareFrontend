'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

import Logo from './Logo';
import Button from '@/components/ui/Button';
import { navLinks } from '@/data/navigation';
import { EASE } from '@/lib/motion';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the drawer on route change and lock body scroll while it is open.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const isActive = (href) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  // Every page opens on a dark forest hero, so the header sits inverted until
  // the visitor scrolls it onto the cream page body.
  const onDark = !scrolled && !open;

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        onDark
          ? 'border-b border-transparent py-4'
          : 'border-b border-forest-100 bg-cream/85 py-2 backdrop-blur-xl',
      )}
      style={{ minHeight: 'var(--header-height)' }}
    >
      <nav className="container flex items-center justify-between gap-6" aria-label="Primary">
        <Logo invert={onDark} />

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  'relative rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  onDark
                    ? isActive(link.href)
                      ? 'text-white'
                      : 'text-forest-100/70 hover:text-white'
                    : isActive(link.href)
                      ? 'text-forest-900'
                      : 'text-forest-700/70 hover:text-forest-900',
                )}
                aria-current={isActive(link.href) ? 'page' : undefined}
              >
                {isActive(link.href) ? (
                  <motion.span
                    layoutId="nav-pill"
                    className={cn(
                      'absolute inset-0 -z-10 rounded-full',
                      onDark ? 'bg-white/10' : 'bg-forest-100',
                    )}
                    transition={{ duration: 0.4, ease: EASE }}
                  />
                ) : null}
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Button
            href="/invest"
            size="sm"
            variant={onDark ? 'gold' : 'primary'}
            className="hidden sm:inline-flex"
            withArrow
          >
            Invest With Us
          </Button>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full border transition lg:hidden',
              onDark
                ? 'border-white/25 text-cream hover:bg-white/10'
                : 'border-forest-200 text-forest-800 hover:bg-forest-50',
            )}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
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
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <div className="container mt-4 overflow-hidden rounded-2xl border border-forest-100 bg-white p-3 shadow-lift">
              <ul className="flex flex-col">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.35, ease: EASE }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        'block rounded-xl px-4 py-3 text-base font-medium transition-colors',
                        isActive(link.href)
                          ? 'bg-forest-50 text-forest-900'
                          : 'text-forest-700 hover:bg-forest-50',
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
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
