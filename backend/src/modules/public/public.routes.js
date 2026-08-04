import { Router } from "express";

import { publicWriteLimiter } from "../../middleware/rateLimit.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as blocks from "../content/blocks.service.js";
import * as settings from "../content/settings.service.js";
import {
  benchmarks,
  boardMembers,
  jobOpenings,
  portfolioCompanies,
  roadmapMilestones,
  sectors,
} from "../content/resources.js";
import * as enquiries from "../enquiries/enquiries.service.js";

/**
 * Everything here is unauthenticated and read-only, with one exception: the
 * contact form needs to write, so it is rate limited.
 *
 * Only published rows are ever returned — an unpublished record is invisible
 * to the public API, not merely hidden by the frontend.
 */

const router = Router();

const published = { publishedOnly: true };

/**
 * One request that returns the whole site. The frontend is statically
 * generated, so it fetches this once at build time rather than making nine
 * round trips per page.
 */
router.get(
  "/site",
  asyncHandler(async (_req, res) => {
    const [
      documents,
      groups,
      board,
      sectorList,
      portfolio,
      roadmap,
      benchmarkList,
      jobs,
    ] = await Promise.all([
      settings.getAll(),
      blocks.listAllGroups(published),
      boardMembers.list(published),
      sectors.list(published),
      portfolioCompanies.list(published),
      roadmapMilestones.list(published),
      benchmarks.list(published),
      jobOpenings.list(published),
    ]);

    const group = (key) => groups[key] ?? [];

    res.json({
      success: true,
      data: {
        company: documents.company ?? {},
        incorporation: {
          ...(documents.incorporation ?? {}),
          details: group("incorporation.details").map(({ label, value }) => ({ label, value })),
          governancePillars: group("incorporation.governance").map(({ title }) => title),
        },
        contact: {
          ...(documents.contact ?? {}),
          phones: group("contact.phones").map(({ label, value }) => ({ name: label, number: value })),
        },
        values: group("company.values").map(({ title, body }) => ({ title, body })),
        capital: documents.capital ?? {},
        investorQuote: documents.investorQuote ?? {},
        seo: documents.seo ?? {},

        board,
        sectors: sectorList,
        portfolio,
        portfolioStats: group("portfolio.stats").map(({ value, label }) => ({ value, label })),
        roadmap,
        benchmarks: benchmarkList,
        jobs,

        holdingPrinciples: group("invest.holdingPrinciples").map(({ title }) => title),
        nepalStats: group("invest.nepalStats").map(({ value, label }) => ({ value, label })),
        nepalMomentum: group("invest.nepalMomentum").map(({ body }) => body),
        nepalWhyNow: group("invest.nepalWhyNow").map(({ body }) => body),

        landing: {
          ticker: group("landing.ticker").map(({ title }) => title),
          // `body` carries the small note under each figure.
          stats: group("landing.stats").map(({ value, label, body }) => ({ value, label, body })),
          valueProps: group("landing.valueProps").map(({ title, body }) => ({ title, body })),
          investorCommitments: group("landing.investorCommitments").map(({ title, body }) => ({
            title,
            body,
          })),
        },
      },
    });
  })
);

// --- Individual collections, for pages that need only one ------------------

const collection = (path, resource) =>
  router.get(
    path,
    asyncHandler(async (_req, res) => {
      res.json({ success: true, data: await resource.list(published) });
    })
  );

collection("/board", boardMembers);
collection("/sectors", sectors);
collection("/portfolio", portfolioCompanies);
collection("/roadmap", roadmapMilestones);
collection("/benchmarks", benchmarks);
collection("/jobs", jobOpenings);

router.get(
  "/settings",
  asyncHandler(async (_req, res) => {
    res.json({ success: true, data: await settings.getAll() });
  })
);

router.get(
  "/blocks/:group",
  asyncHandler(async (req, res) => {
    res.json({ success: true, data: await blocks.listGroup(req.params.group, published) });
  })
);

// --- The one public write --------------------------------------------------

router.post(
  "/enquiries",
  publicWriteLimiter,
  asyncHandler(async (req, res) => {
    await enquiries.create(req.body);
    // Deliberately returns nothing about the stored record — a public endpoint
    // should not hand back ids it does not need to.
    res.status(201).json({ success: true, message: "Thank you — we will be in touch." });
  })
);

export default router;
