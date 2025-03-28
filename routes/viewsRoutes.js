import express from "express";
import {
  getHomepagePage,
  getRegisterPage,
  getLoginPage,
} from "../controllers/viewsController.js";

const router = express.Router();

//
router.get("/", getHomepagePage);

// for authentication
router.get("/register", getRegisterPage);
router.get("/login", getLoginPage);

export default router;
