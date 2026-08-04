import { defineResource } from "../../utils/resource.js";

/**
 * Every list-shaped content type on the site, declared once.
 *
 * Adding a field is a line here plus a column in schema.sql — validation, the
 * API shape, ordering and the admin endpoints all follow automatically.
 */

export const boardMembers = defineResource({
  table: "board_members",
  slugFrom: "name",
  searchable: ["name", "role"],
  fields: {
    slug: { type: "string" },
    name: { type: "string", required: true },
    role: { type: "string" },
    credentials: { type: "string" },
    bio: { type: "text" },
    image: { type: "string" },
  },
});

export const sectors = defineResource({
  table: "sectors",
  slugFrom: "name",
  searchable: ["name"],
  fields: {
    slug: { type: "string" },
    name: { type: "string", required: true },
    share: { type: "number", required: true },
    icon: { type: "string" },
    color: { type: "string" },
    body: { type: "text" },
  },
});

export const portfolioCompanies = defineResource({
  table: "portfolio_companies",
  slugFrom: "name",
  searchable: ["name", "brand", "sector"],
  fields: {
    slug: { type: "string" },
    name: { type: "string", required: true },
    brand: { type: "string" },
    location: { type: "string" },
    sector: { type: "string" },
    icon: { type: "string" },
    status: { type: "string" },
    summary: { type: "text" },
    profile: { type: "text" },
    metrics: { type: "stringArray" },
    image: { type: "string" },
    image_hint: { type: "string" },
    logo: { type: "string" },
  },
});

export const roadmapMilestones = defineResource({
  table: "roadmap_milestones",
  searchable: ["title"],
  fields: {
    date_label: { type: "string", required: true, key: "date" },
    title: { type: "string", required: true },
    detail: { type: "text" },
  },
});

export const benchmarks = defineResource({
  table: "benchmarks",
  searchable: ["name", "country"],
  fields: {
    name: { type: "string", required: true },
    country: { type: "string" },
    figure: { type: "string" },
    caption: { type: "string" },
    featured: { type: "boolean" },
    points: { type: "stringArray" },
  },
});

export const jobOpenings = defineResource({
  table: "job_openings",
  slugFrom: "title",
  searchable: ["title", "department", "location"],
  fields: {
    slug: { type: "string" },
    title: { type: "string", required: true },
    department: { type: "string" },
    location: { type: "string" },
    employment_type: { type: "string" },
    summary: { type: "text" },
    description: { type: "text" },
    requirements: { type: "stringArray" },
    apply_email: { type: "string" },
    closes_on: { type: "date" },
  },
});
