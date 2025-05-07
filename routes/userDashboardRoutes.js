import express from "express";
import {
  renderDashboard,
  userSubscription,
} from "../controllers/userDashboardController.js";
import { protect } from "../middleware/protect.js";
import { restrictTo } from "../middleware/restrictTo.js";

const router = express.Router();

router.get("/", protect, restrictTo("user"), renderDashboard);
router.get("/subscription", protect, restrictTo("user"), userSubscription);

export default router;
