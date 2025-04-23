import express from "express";
import {
  homePage,
  createShortUrl,
  redirectToUrl,
} from "../controllers/indexController.js";

import {
  renderRegisterPage,
  renderLoginPage,
  handleRegistration,
  handleLogin,
  handleLogout,
} from "../controllers/authController.js";

import { createFreePlan, monthlyPlan } from "../controllers/planController.js";

// validation middlewares
import { validateUrl } from "../middleware/validateUrl.js";
import { validateRegisters } from "../middleware/validateRegister.js";
import { validateLogin } from "../middleware/validateLogin.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();

// for authentication
router
  .route("/register")
  .get(renderRegisterPage)
  .post(validateRegisters, handleRegistration);
router.route("/login").get(renderLoginPage).post(validateLogin, handleLogin);
router.route("/logout").get(handleLogout);

router.route("/").get(homePage).post(protect, validateUrl, createShortUrl);

// need to change
router.post("/free-plan", createFreePlan);
router.post("/month-plan", monthlyPlan);

router.get("/:urlid", redirectToUrl);

export default router;
