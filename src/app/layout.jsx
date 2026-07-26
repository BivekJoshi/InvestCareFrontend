import { Inter, Fraunces, Great_Vibes } from 'next/font/google';
import './globals.css';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Preloader from '@/components/layout/Preloader';
import ScrollProgress from '@/components/layout/ScrollProgress';
import ThemeProvider from '@/theme/ThemeProvider';
import CustomCursor from '@/components/layout/CustomCursor';
import { company } from '@/data/company';
import { brand } from '@/theme';

const sans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const display = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '600', '700'],
  variable: '--font-display',
});

/**
 * Flourish face. Used for eyebrows, taglines and accented words only — never
 * for body copy or figures, where a formal script costs too much legibility.
 */
const script = Great_Vibes({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400'],
  variable: '--font-script',
});

export const metadata = {
  metadataBase: new URL('https://investcare.com.np'),
  title: {
    default: `${company.name} — ${company.tagline}`,
    template: `%s | ${company.name}`,
  },
  description:
    "Invest Care Limited is a Nepali investment holding company deploying disciplined capital across hospitality, manufacturing, agro-processing, pharma, IT and hydropower — now raising promoter capital ahead of a planned public offering.",
  keywords: [
    'Invest Care Limited',
    'investment holding company Nepal',
    'SEBON IPO',
    'NEPSE',
    'Nepal private equity',
    'promoter capital',
  ],
  openGraph: {
    title: `${company.name} — ${company.tagline}`,
    description:
      'A diversified Nepali investment holding company with five active portfolio companies and a sequenced, SEBON-compliant path to listing.',
    type: 'website',
    locale: 'en_US',
    siteName: company.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${company.name} — ${company.tagline}`,
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: brand.themeColor,
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${script.variable}`}>
      <body className="flex min-h-screen flex-col">
        <ThemeProvider>
          <Preloader />
          <ScrollProgress />
          <CustomCursor />
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]
                       focus:rounded-lg focus:bg-forest-800 focus:px-4 focus:py-2 focus:text-cream"
          >
            Skip to content
          </a>
          <Navbar />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
