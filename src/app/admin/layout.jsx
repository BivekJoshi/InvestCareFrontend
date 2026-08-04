/**
 * The CMS lives under /admin. It is reachable by direct URL but is linked from
 * nowhere on the public site, kept out of the sitemap, and marked noindex so a
 * crawler that stumbles on it never puts it in a search result.
 */
export const metadata = {
  title: {
    default: 'CMS',
    template: '%s | Invest Care CMS',
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function AdminLayout({ children }) {
  return <div className="min-h-screen bg-forest-950 text-cream">{children}</div>;
}
