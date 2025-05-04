import express from "express";
import {
  rendrAdminDashboard,
  renderUserDashboard,
  renderSubscriptionboard,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/", rendrAdminDashboard);
router.get("/users", renderUserDashboard);
router.get("/subscription", renderSubscriptionboard);

export default router;
