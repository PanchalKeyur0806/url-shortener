import express from "express";
import {
  homePage,
  createShortUrl,
  redirectToUrl,
} from "../controllers/viewsController/indexController.js";

import {
  renderRegisterPage,
  renderLoginPage,
  handleRegistration,
  handleLogin,
} from "../controllers/viewsController/authController.js";

import { createFreePlan } from "../controllers/viewsController/planController.js";

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

router.route("/").get(homePage).post(protect, validateUrl, createShortUrl);

// need to change
router.post("/free-plan", createFreePlan);

router.get("/:urlid", redirectToUrl);

export default router;
