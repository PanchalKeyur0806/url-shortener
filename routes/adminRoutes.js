import express from "express";
import {
  rendrAdminDashboard,
  renderUserDashboard,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/", rendrAdminDashboard);
router.get("/users", renderUserDashboard);

export default router;
