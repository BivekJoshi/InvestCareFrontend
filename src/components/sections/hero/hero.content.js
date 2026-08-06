/**
 * Everything the hero *says*, kept apart from how it renders.
 *
 * Figures are derived from the data modules rather than retyped, so the fold
 * can never drift out of step with the rest of the site.
 */

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


/**
 * The parts of the fold that are derived from CMS content.
 *
 * A function rather than module constants, so the hero re-derives when live
 * content replaces the prerendered copy.
 */
export function buildHeroContent(content) {
  const { portfolio, sectors, capital, incorporation } = content;

  const authorizedCapital = capital?.bars?.[0] ?? { display: '', label: '' };

  /** Looks a registration fact up by label rather than by array position. */
  const detail = (label) =>
    incorporation?.details?.find((entry) => entry.label === label)?.value ?? '';

  return {
    /** `icon` keys are resolved to lucide components in `HeroIntro`. */
    heroTrust: [
      { icon: 'shield', label: 'SEBON-compliant roadmap' },
      { icon: 'landmark', label: detail('Company Type') },
      // The BS date is stored in full; the fold only needs the year.
      { icon: 'calendar', label: `Incorporated ${detail('Incorporated').slice(0, 4)} BS` },
    ],

    /** Drives the card on the right of the fold — the capital already at work. */
    heroPortfolio: {
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
    },

    /**
     * Bottom band of the fold. Numeric entries count up; `text` entries are
     * rendered as-is.
     */
    heroMetrics: [
      { key: 'holdings', value: portfolio.length, pad: true, label: 'Active portfolio companies' },
      { key: 'sectors', value: sectors.length, pad: true, label: 'High-conviction sectors' },
      { key: 'authorized', text: authorizedCapital.display, label: authorizedCapital.label },
      { key: 'Invest Care', text: 'Invest care', label: '2074-06-09 (B.S)' },
    ],
  };
}
