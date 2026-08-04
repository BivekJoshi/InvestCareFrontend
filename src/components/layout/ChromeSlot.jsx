'use client';

import { usePathname } from 'next/navigation';

/**
 * Route prefixes that render without the marketing shell. The CMS is a tool,
 * not a page of the website — it gets no navbar, footer or brand curtain.
 */
const BARE_PREFIXES = ['/admin'];

/**
 * Renders its children only on public marketing routes. Children are still
 * server components — they are passed through as a prop, so wrapping the
 * navbar and footer here does not drag them across the client boundary.
 */
export default function ChromeSlot({ children }) {
  const pathname = usePathname();

  const isBare = BARE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  return isBare ? null : children;
}
