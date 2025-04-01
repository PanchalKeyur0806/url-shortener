import express from "express";
import {
  homePage,
  createShortUrl,
  getRegisterPage,
  getLoginPage,
  redirectToUrl,
} from "../controllers/viewsController/indexController.js";

const router = express.Router();

//
// router.get("/", homePage);
router.route("/").get(homePage).post(createShortUrl);

router.get("/:shortId", redirectToUrl);

// for authentication
router.get("/register", getRegisterPage);
router.get("/login", getLoginPage);

export default router;
