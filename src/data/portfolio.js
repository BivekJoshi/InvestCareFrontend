/**
 * Portfolio holdings.
 *
 * `image` stays null until the real photography exists, so the site renders a
 * labelled placeholder instead of requesting a file that isn't there. Save the
 * asset at the commented path and swap `null` for that string — nothing else
 * needs to change. See /public/images/README.md for the full asset list.
 */
export const portfolio = [
  {
    slug: "sankalpa-hospitality",
    name: "Sankalpa Hospitality Pvt. Ltd.",
    brand: "Brand: Landmark Kathmandu",
    location: "Durbar Marg, Kathmandu",
    sector: "Hospitality & Tourism",
    icon: "hotel",
    status: "Active",
    summary:
      "Upscale city hotel on Durbar Marg, operating under the established Landmark Hotels & Resorts brand.",
    profile:
      "Upscale city hotel on Durbar Marg, Kathmandu, operating under the Landmark Hotels & Resorts brand.",
    metrics: [
      "3 room categories",
      "Restaurant, bar, banquet and conference facilities",
      "6-property brand network",
    ],
    image: null, // drop the file in and set to: '/images/portfolio/sankalpa-hospitality.jpg'
    imageHint: "Hotel exterior or lobby — landscape, 1600×1000",
  },
  {
    slug: "diamond-hill-resort",
    name: "Diamond Hill Resort Pvt. Ltd.",
    brand: "Kathmandu Valley leisure corridor",
    location: "Panauti, Kavrepalanchok",
    sector: "Hospitality & Tourism",
    icon: "mountain",
    status: "Active",
    summary:
      "Nature-led destination resort at Panauti, on the eastern rim of the Kathmandu Valley.",
    profile:
      "Nature-led destination resort on the eastern rim of the Kathmandu Valley, on the Namo Buddha circuit.",
    metrics: [
      "4 room categories",
      "Published rates US$ 120-250 per night",
      "Spa, trekking and event venue",
    ],
    image: "/images/portfolio/DiamondHillResort.png", // drop the file in and set to: '/images/portfolio/diamond-hill-resort.jpg'
    imageHint: "Resort grounds / valley view — landscape, 1600×1000",
  },
  {
    slug: "classic-industries",
    name: "Classic Industries Limited",
    brand: "Classic Mattress · Adira Group",
    location: "Nepal",
    sector: "Manufacturing & Industry",
    icon: "factory",
    status: "Active",
    summary:
      "South Asia's first mattress manufacturer; >85% domestic coverage and a 2,500+ distributor network.",
    profile:
      "South Asia's first mattress manufacturer (est. 1990); a five-company group spanning manufacturing, retail and trading.",
    metrics: [
      ">85% domestic market share",
      "2,500+ distributors",
      "Revenue NPR 63.8 Cr → 181.0 Cr (FY81-82A → FY85-86P)",
    ],
    image: "/images/portfolio/Classic.png", // drop the file in and set to: '/images/portfolio/classic-industries.jpg'
    imageHint: "Factory floor or product line — landscape, 1600×1000",
  },
  {
    slug: "kisan-agrobase",
    name: "Kisan Agrobase Industries Ltd.",
    brand: "KABIL · Thopa · Mulko",
    location: "Nepal",
    sector: "Agriculture & Food Processing",
    icon: "wheat",
    status: "Active",
    summary:
      "Nepal's first licensed natural mineral water manufacturer, operating five agro-processing verticals.",
    profile:
      "Nepal's first licensed natural mineral water manufacturer, operating five agro-processing verticals.",
    metrics: [
      "36,000 L/day bottling capacity",
      "Sales NPR 10.0 Cr → 100.9 Cr (FY82-83 → FY86-87P)",
      "IPO planned FY 2084-85",
    ],
    image: "/images/portfolio/kisan.png", // drop the file in and set to: '/images/portfolio/kisan-agrobase.jpg'
    imageHint: "Bottling plant or product range — landscape, 1600×1000",
  },
  {
    slug: "dobhan-khola-hydropower",
    name: "Dobhan Khola Hydropower",
    brand: "24.5 MW · Gorkha District",
    location: "Gorkha District",
    sector: "Hydropower",
    icon: "zap",
    status: "Active",
    summary:
      "Run-of-river project with PPA, licence and financial closure complete; 22.17% equity IRR.",
    profile:
      "24.5 MW run-of-river project, expandable to 30 MW; PPA, generation licence and financial closure complete.",
    metrics: [
      "22.17% equity IRR",
      "6-year payback",
      "NPR 500 Cr project cost",
      "NPR 125 Cr planned equity base",
    ],
    image: "/images/portfolio/Dobhan.png", // drop the file in and set to: '/images/portfolio/dobhan-khola-hydropower.jpg'
    imageHint: "River / powerhouse site — landscape, 1600×1000",
  },
];

export const portfolioStats = [
  { value: "05", label: "Portfolio companies" },
  { value: "04", label: "Sectors represented" },
  { value: "40%", label: "Target allocation to Hospitality & Tourism" },
];
