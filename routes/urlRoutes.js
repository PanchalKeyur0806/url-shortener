import express from "express";
import {
  getAllUrls,
  createUrl,
  getUrl,
  generateReport,
} from "../controllers/apiController/urlController.js";

const router = express.Router();

router.route("/").get(getAllUrls).post(createUrl);

router.get("/:urlId", getUrl);

router.get("/report/:shortId", generateReport);

export default router;
