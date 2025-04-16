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

import { validateUrl } from "../middleware/validateUrl.js";

const router = express.Router();

// for authentication
router.route("/register").get(renderRegisterPage).post(handleRegistration);
router.route("/login").get(renderLoginPage).post(handleLogin);

router.route("/").get(homePage).post(validateUrl, createShortUrl);

router.get("/:urlid", redirectToUrl);

export default router;
