import express from "express";
import {
  rendrAdminDashboard,
  renderUserDashboard,
  renderSubscriptionboard,
  renderUrlDashboard,
  renderAdminProfile,
} from "../controllers/adminController.js";

import { protect } from "../middleware/protect.js";

const router = express.Router();

router.get("/", rendrAdminDashboard);
router.get("/users", renderUserDashboard);
router.get("/subscription", renderSubscriptionboard);
router.get("/urls", renderUrlDashboard);
router.get("/profile", protect, renderAdminProfile);

export default router;
