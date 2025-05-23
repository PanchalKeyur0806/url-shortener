import express from "express";
import {
  homePage,
  createShortUrl,
  redirectToUrl,
  renderContactUs,
  submitContactPage,
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
import { validateContactPage } from "../middleware/validateContactPage.js";
import { restrictTo } from "../middleware/restrictTo.js";

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
  .get(protect, restrictTo("user"), renderProfile)
  .patch(protect, restrictTo("user"), changeProfile);

router
  .route("/contact-us")
  .get(renderContactUs)
  .post(protect, restrictTo("user"), validateContactPage, submitContactPage);

// our pricing page
router.get("/pricing", renderPricing);

// need to change
router.post("/free-plan", protect, restrictTo("user"), createFreePlan);
router.post("/month-plan", protect, restrictTo("user"), monthlyPlan);
router.post("/yearly-plan", protect, restrictTo("user"), yearlyPlan);

router.get("/:urlid", redirectToUrl);

router.route("/").get(homePage).post(protect, validateUrl, createShortUrl);

export default router;
