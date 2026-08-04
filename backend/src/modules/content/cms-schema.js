/**
 * The shape of the CMS itself: which tabs exist, what sits in each, and which
 * endpoint edits it.
 *
 * Served at GET /api/admin/schema so the admin UI can build its navigation and
 * forms from one description instead of hard-coding them — add a section here
 * and it appears in the CMS without a frontend change.
 *
 * `kind` tells the UI what editor to render:
 *   document — one form, saved whole (PUT)
 *   list     — repeatable rows, reorderable (PUT replaces the group)
 *   table    — full CRUD records with their own fields
 *   inbox    — read-only records with a status workflow
 *   media    — file uploads
 */

export const CMS_TABS = [
  {
    key: "company",
    label: "Company",
    description: "Who Invest Care is — the copy behind the About page and the site footer.",
    sections: [
      {
        key: "company",
        label: "Profile",
        help: "The company name, tagline and the introductory paragraphs used on the About page and in page titles.",
        kind: "document",
        endpoint: "/api/admin/settings/company",
        fields: [
          { key: "name", label: "Legal name", type: "text", required: true },
          { key: "shortName", label: "Short name", type: "text" },
          { key: "tagline", label: "Tagline", type: "text" },
          { key: "profileDate", label: "Profile date", type: "text" },
          { key: "intro", label: "Introduction", type: "richtext" },
          { key: "introSecondary", label: "Introduction (second paragraph)", type: "richtext" },
          { key: "mission", label: "Mission", type: "richtext" },
          { key: "vision", label: "Vision", type: "richtext" },
        ],
      },
      {
        key: "company.values",
        label: "Core values",
        help: "The three principles shown on the About page.",
        kind: "list",
        endpoint: "/api/admin/blocks/company.values",
        itemFields: [
          { key: "title", label: "Value", type: "text", required: true },
          { key: "body", label: "Description", type: "textarea" },
        ],
      },
      {
        key: "incorporation",
        label: "Incorporation",
        help: "The paragraph above the legal details table on the About page.",
        kind: "document",
        endpoint: "/api/admin/settings/incorporation",
        fields: [{ key: "summary", label: "Summary", type: "richtext" }],
      },
      {
        key: "incorporation.details",
        label: "Legal details",
        help: "The legal facts table on the About page — one row each.",
        kind: "list",
        endpoint: "/api/admin/blocks/incorporation.details",
        itemFields: [
          { key: "label", label: "Label", type: "text", required: true },
          { key: "value", label: "Value", type: "text", required: true },
        ],
      },
      {
        key: "incorporation.governance",
        label: "Governance pillars",
        help: "The short checklist beside the incorporation details.",
        kind: "list",
        endpoint: "/api/admin/blocks/incorporation.governance",
        itemFields: [{ key: "title", label: "Pillar", type: "text", required: true }],
      },
      {
        key: "contact",
        label: "Contact details",
        kind: "document",
        help: "Shown in the footer of every page and on the Contact page.",
        endpoint: "/api/admin/settings/contact",
        fields: [
          { key: "office", label: "Registered office", type: "textarea" },
          { key: "email", label: "Email", type: "email" },
          { key: "phone", label: "Phone", type: "tel", placeholder: "01-4567890 or 9851030949" },
        ],
      },
      {
        key: "contact.phones",
        label: "Direct lines",
        kind: "list",
        help: "Individual directors' numbers, listed under the main phone number. Leave empty to show only the main number.",
        endpoint: "/api/admin/blocks/contact.phones",
        itemFields: [
          { key: "label", label: "Name", type: "text", required: true },
          { key: "value", label: "Phone number", type: "text", required: true },
        ],
      },
    ],
  },

  {
    key: "leadership",
    label: "Leadership",
    description: "Board of directors and the company secretary.",
    sections: [
      {
        key: "board",
        label: "Board members",
        kind: "table",
        endpoint: "/api/admin/board",
        reorderable: true,
        fields: [
          { key: "name", label: "Name", type: "text", required: true },
          { key: "role", label: "Role", type: "text" },
          { key: "credentials", label: "Credentials", type: "text" },
          { key: "bio", label: "Biography", type: "textarea" },
          { key: "image", label: "Portrait", type: "image" },
        ],
      },
    ],
  },

  {
    key: "portfolio",
    label: "Portfolio",
    description: "Holdings shown on the landing page and the portfolio page.",
    sections: [
      {
        key: "portfolio",
        label: "Companies",
        kind: "table",
        endpoint: "/api/admin/portfolio",
        reorderable: true,
        fields: [
          { key: "name", label: "Company name", type: "text", required: true },
          { key: "brand", label: "Brand line", type: "text" },
          { key: "location", label: "Location", type: "text" },
          { key: "sector", label: "Sector", type: "text" },
          { key: "icon", label: "Icon", type: "icon" },
          { key: "status", label: "Status", type: "select", options: ["Active", "Exited", "Pipeline"] },
          { key: "summary", label: "Short summary", type: "textarea" },
          { key: "profile", label: "Full profile", type: "textarea" },
          { key: "metrics", label: "Key metrics", type: "stringList" },
          { key: "image", label: "Photograph", type: "image" },
          { key: "logo", label: "Logo", type: "image" },
        ],
      },
      {
        key: "portfolio.stats",
        label: "Headline stats",
        help: "The three figures above the portfolio grid.",
        kind: "list",
        endpoint: "/api/admin/blocks/portfolio.stats",
        itemFields: [
          { key: "value", label: "Figure", type: "text", required: true },
          { key: "label", label: "Caption", type: "text", required: true },
        ],
      },
    ],
  },

  {
    key: "sectors",
    label: "Sectors",
    description: "Target capital allocation. Shares should total 100%.",
    sections: [
      {
        key: "sectors",
        label: "Sectors",
        kind: "table",
        endpoint: "/api/admin/sectors",
        reorderable: true,
        fields: [
          { key: "name", label: "Sector", type: "text", required: true },
          { key: "share", label: "Allocation %", type: "number", required: true },
          { key: "icon", label: "Icon", type: "icon" },
          { key: "color", label: "Colour", type: "color" },
          { key: "body", label: "Description", type: "textarea" },
        ],
      },
    ],
  },

  {
    key: "invest",
    label: "Invest",
    description: "The capital raise, the path to listing and the market case.",
    sections: [
      {
        key: "capital",
        label: "Capital structure",
        kind: "document",
        endpoint: "/api/admin/settings/capital",
        fields: [
          { key: "bars", label: "Capital bars", type: "json" },
          { key: "buildUp", label: "Promoter capital build-up", type: "json" },
          { key: "buildUpTotal", label: "Build-up total", type: "json" },
          { key: "ask", label: "The ask", type: "json" },
        ],
      },
      {
        key: "roadmap",
        label: "Path to listing",
        kind: "table",
        endpoint: "/api/admin/roadmap",
        reorderable: true,
        fields: [
          { key: "date", label: "Date", type: "text", required: true },
          { key: "title", label: "Milestone", type: "text", required: true },
          { key: "detail", label: "Detail", type: "textarea" },
        ],
      },
      {
        key: "benchmarks",
        label: "Global benchmarks",
        kind: "table",
        endpoint: "/api/admin/benchmarks",
        reorderable: true,
        fields: [
          { key: "name", label: "Company", type: "text", required: true },
          { key: "country", label: "Country", type: "text" },
          { key: "figure", label: "Headline figure", type: "text" },
          { key: "caption", label: "Caption", type: "text" },
          { key: "featured", label: "Featured", type: "boolean" },
          { key: "points", label: "Bullet points", type: "stringList" },
        ],
      },
      {
        key: "invest.holdingPrinciples",
        label: "Holding principles",
        help: "The four principles listed on the Invest page.",
        kind: "list",
        endpoint: "/api/admin/blocks/invest.holdingPrinciples",
        itemFields: [{ key: "title", label: "Principle", type: "text", required: true }],
      },
      {
        key: "invest.nepalStats",
        label: "Nepal market stats",
        help: "The four market figures on the Invest page.",
        kind: "list",
        endpoint: "/api/admin/blocks/invest.nepalStats",
        itemFields: [
          { key: "value", label: "Figure", type: "text", required: true },
          { key: "label", label: "Caption", type: "text", required: true },
        ],
      },
      {
        key: "invest.nepalMomentum",
        label: "Market momentum",
        help: "Bullet points under \"Market momentum\" on the Invest page.",
        kind: "list",
        endpoint: "/api/admin/blocks/invest.nepalMomentum",
        itemFields: [{ key: "body", label: "Point", type: "textarea", required: true }],
      },
      {
        key: "invest.nepalWhyNow",
        label: "Why now",
        help: "Bullet points under \"Why now\" on the Invest page.",
        kind: "list",
        endpoint: "/api/admin/blocks/invest.nepalWhyNow",
        itemFields: [{ key: "body", label: "Point", type: "textarea", required: true }],
      },
    ],
  },

  {
    key: "landing",
    label: "Landing page",
    description: "Sections that appear only on the homepage.",
    sections: [
      {
        key: "landing.ticker",
        label: "Ticker band",
        help: "The scrolling phrases in the band directly under the homepage hero.",
        kind: "list",
        endpoint: "/api/admin/blocks/landing.ticker",
        itemFields: [{ key: "title", label: "Phrase", type: "text", required: true }],
      },
      {
        key: "landing.stats",
        label: "Stats band",
        help: "The four counting figures on the homepage. Type each figure as it should read — \"05\", \"100+\", \"22.17%\" — and the site animates the number.",
        kind: "list",
        endpoint: "/api/admin/blocks/landing.stats",
        // The figure animates: type it as it should read ("05", "22.17%") and
        // the site splits the number from its decoration.
        itemFields: [
          { key: "value", label: "Figure", type: "text", required: true },
          { key: "label", label: "Caption", type: "text", required: true },
          { key: "body", label: "Note", type: "text" },
        ],
      },
      {
        key: "landing.valueProps",
        label: "Why invest",
        help: "The \"Why invest\" cards on the homepage.",
        kind: "list",
        endpoint: "/api/admin/blocks/landing.valueProps",
        itemFields: [
          { key: "title", label: "Heading", type: "text", required: true },
          { key: "body", label: "Body", type: "textarea" },
        ],
      },
      {
        key: "landing.investorCommitments",
        label: "Investor commitments",
        help: "The commitments listed near the foot of the homepage.",
        kind: "list",
        endpoint: "/api/admin/blocks/landing.investorCommitments",
        itemFields: [
          { key: "title", label: "Heading", type: "text", required: true },
          { key: "body", label: "Body", type: "textarea" },
        ],
      },
      {
        key: "investorQuote",
        label: "Pull quote",
        help: "The large pull quote near the bottom of the homepage.",
        kind: "document",
        endpoint: "/api/admin/settings/investorQuote",
        fields: [
          { key: "text", label: "Quote", type: "textarea", required: true },
          { key: "attribution", label: "Attribution", type: "text" },
        ],
      },
    ],
  },

  {
    key: "careers",
    label: "Careers",
    description: "Open roles. Unpublish a role to hide it without deleting it.",
    sections: [
      {
        key: "jobs",
        label: "Job openings",
        kind: "table",
        endpoint: "/api/admin/jobs",
        reorderable: true,
        fields: [
          { key: "title", label: "Job title", type: "text", required: true },
          { key: "department", label: "Department", type: "text" },
          { key: "location", label: "Location", type: "text" },
          { key: "employmentType", label: "Type", type: "select", options: ["Full-time", "Part-time", "Contract", "Internship"] },
          { key: "summary", label: "Summary", type: "textarea" },
          { key: "description", label: "Description", type: "richtext" },
          { key: "requirements", label: "Requirements", type: "stringList" },
          { key: "applyEmail", label: "Apply to (email)", type: "email" },
          { key: "closesOn", label: "Closing date", type: "date" },
        ],
      },
    ],
  },

  {
    key: "enquiries",
    label: "Enquiries",
    description: "Messages from the website contact form.",
    sections: [
      {
        key: "enquiries",
        label: "Inbox",
        kind: "inbox",
        endpoint: "/api/admin/enquiries",
        statuses: ["new", "read", "replied", "archived"],
      },
    ],
  },

  {
    key: "media",
    label: "Media",
    description: "Images used across the site.",
    sections: [
      {
        key: "media",
        label: "Library",
        kind: "media",
        endpoint: "/api/admin/media",
        accept: ["image/jpeg", "image/png", "image/webp", "image/avif", "image/svg+xml"],
        maxSizeMb: 5,
      },
    ],
  },

  {
    key: "settings",
    label: "Settings",
    description: "Search-engine defaults and your own account.",
    sections: [
      {
        key: "seo",
        label: "SEO defaults",
        kind: "document",
        endpoint: "/api/admin/settings/seo",
        fields: [
          { key: "title", label: "Default title", type: "text" },
          { key: "description", label: "Default description", type: "textarea" },
          { key: "ogImage", label: "Share image", type: "image" },
        ],
      },
      {
        key: "account",
        label: "Your account",
        kind: "document",
        endpoint: "/api/auth/change-password",
        fields: [
          { key: "currentPassword", label: "Current password", type: "password", required: true },
          { key: "newPassword", label: "New password", type: "password", required: true },
        ],
      },
    ],
  },
];

/** Group keys the block editor accepts — derived so the two can never drift. */
export const BLOCK_GROUPS = CMS_TABS.flatMap((tab) =>
  tab.sections.filter((section) => section.kind === "list").map((section) => section.key)
);
