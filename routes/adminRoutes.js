import express from "express";
import { rendrAdminDashboard } from "../controllers/adminController.js";

const router = express.Router();

router.get("/", rendrAdminDashboard);

export default router;
