import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import { loginLimiter } from "../../middleware/rateLimit.js";
import {
  changePasswordHandler,
  loginHandler,
  logoutHandler,
  meHandler,
} from "./auth.controller.js";

const router = Router();

router.post("/login", loginLimiter, loginHandler);
router.get("/me", requireAuth, meHandler);
router.post("/logout", requireAuth, logoutHandler);
router.post("/change-password", requireAuth, changePasswordHandler);

export default router;
