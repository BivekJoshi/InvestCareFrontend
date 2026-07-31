/**
 * Single source of truth for company-level facts.
 * Sourced from the Invest Care Limited Business Profile (Shrawan 2083 / July 2026).
 */

export const company = {
  name: 'Invest Care Limited',
  shortName: 'Invest Care',
  tagline: 'Your Capital. Our Commitment.',
  profileDate: 'Shrawan, 2083 | July 2026',
  intro:
    'Invest Care Limited is an investment holding company, built on disciplined capital stewardship and a clear commitment to long-term value creation. We take an active, hands-on approach to portfolio management, combining institutional capital with strategic insight to back promising enterprises, unlock hidden potential, and drive growth through focused, responsible engagement.',
  introSecondary:
    'As a Public Limited Company, Invest Care is now raising promoter capital ahead of a planned public offering to broaden its capital base and deepen investor participation.',
  mission:
    "To identify and scale high-potential businesses across Nepal's key sectors by deploying targeted capital and operational discipline that generate superior, sustainable returns for all stakeholders.",
  vision:
    "To be Nepal's most respected investment holding company, setting the standard for integrity, transformative industrial impact, and lasting commercial success.",
  values: [
    {
      title: 'Transparency & Accountability',
      body: 'Open books, periodic disclosure and a board answerable to every shareholder.',
    },
    {
      title: 'Disciplined Risk Management',
      body: 'Capital is committed only where downside is understood, priced and contained.',
    },
    {
      title: 'Operational Excellence',
      body: 'Active ownership — we work alongside management, not from a distance.',
    },
  ],
};

export const incorporation = {
  summary:
    "Invest Care Limited is incorporated under the Companies Act of Nepal and operates within the country's established legal and financial framework. The company maintains full regulatory compliance, strong institutional transparency, and rigorous governance standards, and is now preparing for its planned public offering as a Public Limited Company.",
  details: [
    { label: 'Legal Name', value: 'Invest Care Limited' },
    { label: 'Company Type', value: 'Public Limited Company' },
    { label: 'Incorporated', value: '2074-06-09 BS' },
    // { label: 'Registration Number', value: '175982/074/075' },
    // { label: 'Permanent Account No.', value: '606875855' },
    {
      label: 'Registered Office',
      value: 'Fourth Floor, Krishna Tower, New Baneshwor-10, Kathmandu',
    },
  ],
  governancePillars: [
    'Full SEBON & regulatory compliance',
    'Independent board oversight',
    'Statutory audit & disclosure',
  ],
};

export const contact = {
  office: 'Fourth Floor, Krishna Tower, New Baneshwor-10, Kathmandu, Nepal',
  email: 'investcarelimited@gmail.com',
  phones: [
    // { name: 'Madhu Poudel', number: '9851030949' },
    // { name: 'CN Pandey', number: '9851030564' },
    // { name: 'CM Niroula', number: '9841116357' },
    // { name: 'Narayan Adhikari', number: '9851094119' },
  ],
};

export const capital = {
  bars: [
    { label: 'Authorized Capital', value: 60.0, display: 'NPR 60.00 Cr', tone: 'deep' },
    { label: 'Issued Capital', value: 50.88, display: 'NPR 50.88 Cr', tone: 'primary' },
    {
      label: "Total Promoter's Paid-Up Capital",
      value: 38.16,
      display: 'NPR 38.16 Cr',
      tone: 'muted',
    },
    {
      label: 'IPO Provision (25% of Issued Capital)',
      value: 12.72,
      display: 'NPR 12.72 Cr',
      tone: 'gold',
    },
  ],
  buildUp: [
    { label: 'Existing Paid-Up Capital', value: 'NPR 10.00 Cr' },
    { label: 'Additional Paid-Up Capital', value: 'NPR 28.16 Cr' },
  ],
  buildUpTotal: { label: 'Total Promoter Capital', value: 'NPR 38.16 Cr' },
  // The ask is quoted in capital units rather than currency. `amount` is the
  // same figure as a bare number, kept alongside the display string so charts
  // and progress bars never have to parse the label.
  ask: {
    current: { label: 'Current Capital Units', value: '263 Units', amount: 263 },
    additional: { label: 'Additional Units Sought', value: '737 Units', amount: 737 },
    target: { label: 'Target Capital Units', value: '1,000 Units', amount: 1000 },
    note: 'Followed by an IPO Provision of 333 Units (25% of issued capital) to open the company to public shareholders.',
  },
};

export const roadmap = [
  {
    date: 'Ashad, 2083',
    title: 'Open for Investment',
    detail: 'Promoter capital round opens to qualified investors.',
  },
  {
    date: 'Ashoj, 2083',
    title: 'Fundraising Completion',
    detail: "Promoter's capital locked.",
  },
  {
    date: 'Ashoj, 2083',
    title: 'Appointment of Issue Manager',
    detail: 'Mandated merchant banker onboarded for the offering.',
  },
  {
    date: 'Kartik, 2083',
    title: 'Annual General Meeting',
    detail: 'AGM to pass the IPO resolution.',
  },
  {
    date: 'Mangsir, 2083',
    title: 'Credit Rating',
    detail: 'Appointment of issuer rating agency.',
  },
  {
    date: 'Target',
    title: 'IPO Application',
    detail: 'Application to SEBON with full documentation.',
  },
];

export const globalBenchmarks = [
  {
    name: 'Berkshire Hathaway',
    country: 'United States',
    figure: 'US$ 1.07 Trillion',
    caption: 'Market capitalization (Jul 2026)',
    featured: true,
    points: [
      '80+ operating companies spanning insurance, rail freight, energy, manufacturing and retail',
      '~10% annualized market-cap growth over the past five years',
      'Built since 1965 under Warren Buffett on long-term ownership of quality businesses',
    ],
  },
  {
    name: 'Blackstone',
    country: 'United States',
    figure: 'US$ 1.3 Trillion',
    caption: 'Assets under management (Q1 2026)',
    featured: false,
    points: [
      "World's largest alternative asset manager, AUM up 12% year-on-year to a record high",
      '~12,500 real estate assets and 250+ portfolio companies globally',
      'Strategies spanning private equity, real estate, credit and infrastructure',
    ],
  },
];

export const holdingPrinciples = [
  'Patient, Long-Term Capital',
  'Active Ownership & Governance',
  'Diversification Across Cycles',
  'Aligned Promoter Interests',
];

export const nepalStats = [
  { value: 'NPR 4.85 Tn', label: 'NEPSE market cap — ~78-80% of GDP (Mar 2026)' },
  { value: '263', label: 'Companies listed on NEPSE (Mar 2026)' },
  { value: '42,000+ MW', label: "Nepal's hydropower potential, mostly untapped" },
  { value: '~5.0%', label: 'GDP growth projected to rebound in FY2027' },
];

export const nepalMomentum = [
  'SEBON’s 2026 IPO reforms introduce book-building pricing and premium-pricing eligibility for larger, profitable issuers',
  'A cabinet-backed study committee is reviewing a new stock exchange license to modernize and diversify NEPSE',
  'A growing wave of holding and investment companies (e.g. Brahma Jyoti Holdings, R.K.D. Holdings, R.S.T.C.A. Investment Fund) are advancing toward IPO, validating the model Invest Care is pursuing',
];

export const nepalWhyNow = [
  'Near-term growth is moderating in FY2026 amid external shocks, with a rebound toward ~5% projected for FY2027 (ADB, World Bank)',
  'Structural tailwinds remain intact: 42,000+ MW of hydropower potential, recovering tourism, and resilient remittance-driven consumption',
  'Rising retail and non-resident Nepali (NRN) participation is deepening secondary-market liquidity for new listings',
];

export const valueProps = [
  {
    title: 'Proven, Live Portfolio',
    body: 'Five companies across hospitality, manufacturing, agro-processing and hydropower — capital already at work, not just a proposal on paper.',
  },
  {
    title: 'Diversified Exposure',
    body: 'Portfolio spans 6 high-growth sectors, reducing concentration risk while opening multiple pathways to upside.',
  },
  {
    title: 'Seasoned Leadership',
    body: 'Backed by a board with 100+ combined years of investing, operations, and governance experience in Nepal and globally.',
  },
  {
    title: "Built for Nepal's Growth",
    body: "Positioned to capture Nepal's demographic dividend, tourism recovery, digital acceleration, and infrastructure-led expansion.",
  },
  {
    title: 'Clear Path to Listing',
    body: 'A fully sequenced SEBON-compliant roadmap from promoter fundraising through to IPO application.',
  },
];

export const investorCommitments = [
  {
    title: 'Transparent Reporting',
    body: 'We keep investors informed with periodic updates on financial performance, portfolio developments, and board-level disclosures.',
  },
  {
    title: 'Aligned Interests',
    body: 'Our promoters are among our largest investors. With significant personal capital at stake, our incentives are fully aligned with yours.',
  },
  {
    title: 'Institutional Governance',
    body: "Guided by independent directors, statutory auditors, and SEBON-compliant controls built to meet the standards of Nepal's most trusted institutions.",
  },
];

export const investorQuote = {
  text: 'Capital is only the beginning. Trust is the real foundation. At Invest Care, we build both through enduring businesses, aligned partnerships, and returns designed to endure.',
  attribution: 'Board of Directors, Invest Care Limited',
};
