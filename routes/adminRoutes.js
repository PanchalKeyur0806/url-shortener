import express from "express";
import {
  rendrAdminDashboard,
  renderUserDashboard,
  renderSubscriptionboard,
  renderUrlDashboard,
  renderAdminProfile,
} from "../controllers/adminController.js";

import { protect } from "../middleware/protect.js";
import { restrictTo } from "../middleware/restrictTo.js";

const router = express.Router();

router.get("/", protect, restrictTo("admin"), rendrAdminDashboard);
router.get("/users", protect, restrictTo("admin"), renderUserDashboard);
router.get(
  "/subscription",
  protect,
  restrictTo("admin"),
  renderSubscriptionboard
);
router.get("/urls", protect, restrictTo("admin"), renderUrlDashboard);
router.get("/profile", protect, restrictTo("admin"), renderAdminProfile);

export default router;
