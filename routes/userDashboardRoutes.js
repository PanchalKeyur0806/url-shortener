import express from "express";
import { renderDashboard } from "../controllers/userDashboardController.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();

router.get("/", protect, renderDashboard);

export default router;
