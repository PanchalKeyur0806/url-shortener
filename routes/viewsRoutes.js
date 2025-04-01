import express from "express";
import {
  homePage,
  createShortUrl,
  getRegisterPage,
  getLoginPage,
} from "../controllers/viewsController/viewsController.js";

const router = express.Router();

//
// router.get("/", homePage);
router.route("/").get(homePage).post(createShortUrl);

// for authentication
router.get("/register", getRegisterPage);
router.get("/login", getLoginPage);

export default router;
