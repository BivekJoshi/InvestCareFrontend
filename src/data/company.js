/**
 * Company-level facts, served from the CMS.
 *
 * The values below come from `generated/site.json`, which `npm run content:pull`
 * refreshes from the API before each build. The export names and shapes are
 * unchanged from when this content was hard-coded, so every component that
 * imports from here keeps working untouched.
 *
 * Editing this file has no effect — edit the content in the CMS instead.
 */

import site from './generated/site.json';

export const company = {
  ...site.company,
  values: site.values,
};

export const incorporation = site.incorporation;

export const contact = site.contact;

export const capital = site.capital;

export const roadmap = site.roadmap;

export const globalBenchmarks = site.benchmarks;

export const holdingPrinciples = site.holdingPrinciples;

export const nepalStats = site.nepalStats;

export const nepalMomentum = site.nepalMomentum;

export const nepalWhyNow = site.nepalWhyNow;

export const valueProps = site.landing.valueProps;

export const investorCommitments = site.landing.investorCommitments;

export const investorQuote = site.investorQuote;

/** Homepage-only sections. Previously hard-coded inside the components. */
export const tickerFacts = site.landing.ticker;

export const landingStats = site.landing.stats;

/** Default metadata, editable under Settings → SEO in the CMS. */
export const seo = site.seo;
