import express from "express";
import {
  renderDashboard,
  userSubscription,
} from "../controllers/userDashboardController.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();

router.get("/", protect, renderDashboard);
router.get("/subscription", protect, userSubscription);

export default router;
