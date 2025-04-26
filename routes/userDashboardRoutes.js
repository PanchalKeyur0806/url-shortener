import express from "express";
import { renderDashboard } from "../controllers/userDashboardController.js";

const router = express.Router();

router.get("/", renderDashboard);

export default router;
