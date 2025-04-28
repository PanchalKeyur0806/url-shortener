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
  renderProfile,
  changeProfile,
} from "../controllers/authController.js";

import { renderPricing } from "../controllers/subscriptionsController.js";

import {
  createFreePlan,
  monthlyPlan,
  yearlyPlan,
} from "../controllers/planController.js";

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
router
  .route("/profile")
  .get(protect, renderProfile)
  .post(protect, changeProfile);

router.route("/").get(homePage).post(protect, validateUrl, createShortUrl);

// our pricing page
router.get("/pricing", renderPricing);

// need to change
router.post("/free-plan", createFreePlan);
router.post("/month-plan", monthlyPlan);
router.post("/yearly-plan", yearlyPlan);

router.get("/:urlid", redirectToUrl);

export default router;
