import { Router } from "express";

import { requireAuth } from "../../middleware/requireAuth.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as enquiries from "./enquiries.service.js";

const router = Router();
router.use(requireAuth);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const [items, totals] = await Promise.all([
      enquiries.list({ status: req.query.status ?? null, search: req.query.q ?? null }),
      enquiries.counts(),
    ]);
    res.json({ success: true, data: { items, counts: totals } });
  })
);

router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const updated = await enquiries.setStatus(
      req.params.id,
      req.body?.status,
      req.user.id,
      req.body?.notes
    );
    res.json({ success: true, data: updated });
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await enquiries.remove(req.params.id);
    res.json({ success: true, message: "Deleted" });
  })
);

export default router;
