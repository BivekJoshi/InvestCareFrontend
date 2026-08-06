'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import fallback from '@/data/generated/site.json';
import { API_URL } from '@/lib/api';

/**
 * Live content for the public site.
 *
 * The page is prerendered with the content committed in
 * `src/data/generated/site.json`, so it paints instantly and still reads
 * correctly with JavaScript disabled or the API down. Once mounted, the
 * browser asks the CMS for the current content and swaps it in if the request
 * succeeds — an edit therefore shows up on a refresh, without waiting for the
 * next deploy.
 *
 * If the API is unreachable the committed content simply stays. A visitor
 * never sees an empty page because a server is down.
 */
const SiteContentContext = createContext({ content: fallback, status: 'fallback' });

/** `status` is 'fallback' until the API answers, then 'live' or 'error'. */
export const useSiteContent = () => useContext(SiteContentContext);

export default function SiteContentProvider({ children }) {
  const [content, setContent] = useState(fallback);
  const [status, setStatus] = useState('fallback');

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    // Don't leave a hung request holding the fallback hostage.
    const timeout = setTimeout(() => controller.abort(), 8000);

    fetch(`${API_URL}/public/site`, {
      headers: { accept: 'application/json' },
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error('bad status'))))
      .then((payload) => {
        if (!active) return;

        // Guard against a half-populated CMS replacing good content with an
        // empty site — the committed copy is better than a blank page.
        if (payload?.success && payload.data?.company?.name && payload.data.board?.length) {
          setContent(payload.data);
          setStatus('live');
        } else {
          setStatus('error');
        }
      })
      .catch(() => active && setStatus('error'))
      .finally(() => clearTimeout(timeout));

    return () => {
      active = false;
      controller.abort();
      clearTimeout(timeout);
    };
  }, []);

  const value = useMemo(() => ({ content, status }), [content, status]);

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}
