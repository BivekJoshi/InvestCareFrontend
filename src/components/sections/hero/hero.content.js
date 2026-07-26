/**
 * Everything the hero *says*, kept apart from how it renders.
 *
 * Figures are derived from the data modules rather than retyped, so the fold
 * can never drift out of step with the rest of the site.
 */

import { capital, incorporation, roadmap } from '@/data/company';
import { portfolio } from '@/data/portfolio';
import { sectors } from '@/data/sectors';

const ipoMilestone = roadmap.at(-1);
const authorizedCapital = capital.bars[0];

/** Looks a registration fact up by label rather than by array position. */
const detail = (label) =>
  incorporation.details.find((entry) => entry.label === label)?.value ?? '';

export const heroBadge = {
  status: 'Promoter round open',
  location: 'Kathmandu, Nepal',
};

/** One entry per rendered line — the last one carries the gold treatment. */
export const heroHeadline = [
  { text: 'Patient capital,' },
  { text: 'compounding across' },
  { text: 'Nepal.', accent: true },
];

export const heroLead =
  'Invest Care Limited backs promising Nepali enterprises with institutional capital and hands-on ownership — across hospitality, manufacturing, agro-processing, pharma, IT and hydropower.';

export const heroActions = [
  {
    href: '/invest',
    label: 'The Investment Opportunity',
    variant: 'gold',
    withArrow: true,
    magnetic: 0.35,
  },
  {
    href: '/portfolio',
    label: 'Explore Our Portfolio',
    variant: 'ghostLight',
    magnetic: 0.2,
  },
];

/** `icon` keys are resolved to lucide components in `HeroIntro`. */
export const heroTrust = [
  { icon: 'shield', label: 'SEBON-compliant roadmap' },
  { icon: 'landmark', label: detail('Company Type') },
  // The BS date is stored in full; the fold only needs the year.
  { icon: 'calendar', label: `Incorporated ${detail('Incorporated').slice(0, 4)} BS` },
];

/** Drives the promoter-round card on the right of the fold. */
export const heroRaise = {
  eyebrow: 'Promoter capital round',
  status: 'Open',
  target: capital.ask.target,
  current: capital.ask.current,
  additional: capital.ask.additional,
  note: capital.ask.note,
  /** Share of the target already paid up, as a percentage. */
  progress: Math.round((capital.ask.current.amount / capital.ask.target.amount) * 100),
};

/** Stacked avatars closing the raise card — the capital already at work. */
export const heroHoldings = {
  avatars: portfolio.slice(0, 4).map((holding) => ({
    slug: holding.slug,
    icon: holding.icon,
    // Trading names read better than the full legal entity at this size.
    name: holding.name.replace(/ (Pvt\.|Ltd\.|Limited).*$/, ''),
  })),
  summary: `${portfolio.length} active holdings across ${sectors.length} sectors`,
  href: '/portfolio',
};

/**
 * Bottom band of the fold. Numeric entries count up; `text` entries are
 * rendered as-is.
 */
export const heroMetrics = [
  { key: 'holdings', value: portfolio.length, pad: true, label: 'Active portfolio companies' },
  { key: 'sectors', value: sectors.length, pad: true, label: 'High-conviction sectors' },
  { key: 'authorized', text: authorizedCapital.display, label: authorizedCapital.label },
  { key: 'ipo', text: ipoMilestone.date.replace(',', ''), label: `${ipoMilestone.title} · SEBON` },
];
