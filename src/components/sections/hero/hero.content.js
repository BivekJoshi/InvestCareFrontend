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

/**
 * Sector names as they should read inside the fold's card — the full labels
 * from `data/sectors` are too long for a right-aligned tag at this width.
 */
const SHORT_SECTOR = {
  'Hospitality & Tourism': 'Hospitality',
  'Manufacturing & Industry': 'Manufacturing',
  'Agriculture & Food Processing': 'Agro',
  'Information Technology': 'IT',
  'Pharma / Biotech': 'Pharma',
  Hydropower: 'Hydropower',
};

/**
 * The one fact worth reading per holding at card size. Kept here rather than
 * pulled from `metrics[0]`, because the first metric is the most interesting
 * one for only some of the companies.
 */
const HOLDING_DETAIL = {
  'sankalpa-hospitality': 'Landmark Kathmandu · Durbar Marg',
  'diamond-hill-resort': 'Destination resort · Panauti',
  'classic-industries': '>85% domestic market share',
  'kisan-agrobase': '36,000 L/day bottling capacity',
  'dobhan-khola-hydropower': '24.5 MW run-of-river · Gorkha',
};

/** Drives the card on the right of the fold — the capital already at work. */
export const heroPortfolio = {
  eyebrow: 'Capital at work',
  status: 'Live',
  holdings: portfolio.map((holding) => ({
    slug: holding.slug,
    icon: holding.icon,
    // Trading names read better than the full legal entity at this size.
    name: holding.name.replace(/ (Pvt\.|Ltd\.|Limited).*$/, ''),
    sector: SHORT_SECTOR[holding.sector] ?? holding.sector,
    detail: HOLDING_DETAIL[holding.slug] ?? holding.summary,
  })),
  summary: `${portfolio.length} holdings across ${sectors.length} sectors`,
  cta: 'View the full portfolio',
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
