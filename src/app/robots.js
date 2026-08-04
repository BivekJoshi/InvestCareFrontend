// Emitted as a static robots.txt file at build time — see sitemap.js.
export const dynamic = 'force-static';

export default function robots() {
  return {
    // /admin is the CMS. It is linked from nowhere and already sends a noindex
    // header, but a Disallow keeps well-behaved crawlers from ever fetching it.
    rules: [{ userAgent: '*', allow: '/', disallow: '/admin' }],
    sitemap: 'https://investcare.com.np/sitemap.xml',
  };
}
