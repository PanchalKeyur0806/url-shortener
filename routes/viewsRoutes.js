import express from "express";
import {
  getHomepagePage,
  getRegisterPage,
} from "../controllers/viewsController.js";

const router = express.Router();

//
router.get("/", getHomepagePage);

// for authentication
router.get("/register", getRegisterPage);

export default router;
