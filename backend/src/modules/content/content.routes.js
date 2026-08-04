import { Router } from "express";

import { requireAuth } from "../../middleware/requireAuth.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as blocks from "./blocks.service.js";
import * as settings from "./settings.service.js";
import { BLOCK_GROUPS, CMS_TABS } from "./cms-schema.js";
import {
  benchmarks,
  boardMembers,
  jobOpenings,
  portfolioCompanies,
  roadmapMilestones,
  sectors,
} from "./resources.js";

const router = Router();

// ---------------------------------------------------------------------------
// The CMS describes itself, so the admin UI builds its tabs from one source.
// ---------------------------------------------------------------------------

router.get(
  "/schema",
  requireAuth,
  asyncHandler(async (_req, res) => {
    res.json({ success: true, data: { tabs: CMS_TABS } });
  })
);

// ---------------------------------------------------------------------------
// Singleton documents
// ---------------------------------------------------------------------------

router.get(
  "/settings",
  requireAuth,
  asyncHandler(async (_req, res) => {
    res.json({ success: true, data: await settings.getAll() });
  })
);

router.get(
  "/settings/:key",
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json({ success: true, data: await settings.get(req.params.key) });
  })
);

router.put(
  "/settings/:key",
  requireAuth,
  asyncHandler(async (req, res) => {
    const value = await settings.put(req.params.key, req.body, req.user.id);
    res.json({ success: true, data: value });
  })
);

// ---------------------------------------------------------------------------
// Ordered block lists
// ---------------------------------------------------------------------------

const assertGroup = (group) => {
  if (!BLOCK_GROUPS.includes(group)) {
    throw ApiError.badRequest(`Unknown content group "${group}"`, { allowed: BLOCK_GROUPS });
  }
};

router.get(
  "/blocks/:group",
  requireAuth,
  asyncHandler(async (req, res) => {
    assertGroup(req.params.group);
    res.json({ success: true, data: await blocks.listGroup(req.params.group) });
  })
);

/** Save the whole list at once — one Save button, one request. */
router.put(
  "/blocks/:group",
  requireAuth,
  asyncHandler(async (req, res) => {
    assertGroup(req.params.group);
    const items = Array.isArray(req.body) ? req.body : req.body?.items;
    res.json({ success: true, data: await blocks.replaceGroup(req.params.group, items) });
  })
);

router.post(
  "/blocks/:group",
  requireAuth,
  asyncHandler(async (req, res) => {
    assertGroup(req.params.group);
    res.status(201).json({ success: true, data: await blocks.createBlock(req.params.group, req.body) });
  })
);

router.post(
  "/blocks/:group/reorder",
  requireAuth,
  asyncHandler(async (req, res) => {
    assertGroup(req.params.group);
    res.json({ success: true, data: await blocks.reorderGroup(req.params.group, req.body?.ids) });
  })
);

router.patch(
  "/blocks/item/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json({ success: true, data: await blocks.updateBlock(req.params.id, req.body) });
  })
);

router.delete(
  "/blocks/item/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    await blocks.deleteBlock(req.params.id);
    res.json({ success: true, message: "Deleted" });
  })
);

// ---------------------------------------------------------------------------
// Record collections — each gets list / get / create / update / delete / reorder
// ---------------------------------------------------------------------------

router.use("/board", boardMembers.adminRouter());
router.use("/sectors", sectors.adminRouter());
router.use("/portfolio", portfolioCompanies.adminRouter());
router.use("/roadmap", roadmapMilestones.adminRouter());
router.use("/benchmarks", benchmarks.adminRouter());
router.use("/jobs", jobOpenings.adminRouter());

export default router;
