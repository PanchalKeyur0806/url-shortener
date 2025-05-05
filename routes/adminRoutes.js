import express from "express";
import {
  rendrAdminDashboard,
  renderUserDashboard,
  renderSubscriptionboard,
  renderUrlDashboard,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/", rendrAdminDashboard);
router.get("/users", renderUserDashboard);
router.get("/subscription", renderSubscriptionboard);
router.get("/urls", renderUrlDashboard);

export default router;
