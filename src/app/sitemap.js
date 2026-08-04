const BASE_URL = 'https://investcare.com.np';

// Written once at build time. Required by `output: 'export'`, which has no
// server to regenerate it per request.
export const dynamic = 'force-static';

const ROUTES = [
  { path: '/', priority: 1 },
  { path: '/about', priority: 0.8 },
  { path: '/leadership', priority: 0.7 },
  { path: '/portfolio', priority: 0.9 },
  { path: '/invest', priority: 0.9 },
  { path: '/career', priority: 0.5 },
  { path: '/contact', priority: 0.6 },
  { path: '/disclaimer', priority: 0.3 },
];

export default function sitemap() {
  const lastModified = new Date();

  return ROUTES.map(({ path, priority }) => ({
    url: `${BASE_URL}${path}`,
    lastModified,
    changeFrequency: 'monthly',
    priority,
  }));
}
