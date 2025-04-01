import express from "express";
import {
  getAllUrls,
  createShortUrlApi,
  redirectUrlApi,
  generateReport,
} from "../controllers/apiController/urlController.js";

const router = express.Router();

router.route("/").get(getAllUrls).post(createShortUrlApi);

router.get("/:urlId", redirectUrlApi);

router.get("/report/:shortId", generateReport);

export default router;
