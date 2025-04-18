import { nanoid } from "nanoid";
import catchAsync from "../../utils/catchAsync.js";
import Url from "../../models/urlModel.js";
import AppError from "../../utils/appError.js";
import * as urlServices from "../../services/urlServices.js";

const homePage = (req, res) => {
  res.render("index", {
    status: "initial",
    message: "",
    url: "",
    id: "",
    createdUrl: null,
  });
};

const createShortUrl = catchAsync(async (req, res, next) => {
  const { url } = req.body;

  const result = await urlServices.createShortUrl(url);
  const shortUrl = `${req.protocol}://${req.get("host")}/${result.shortId}`;

  res.render("index", {
    status: "success",
    message: "url created successfully",
    url: shortUrl,
    id: result.shortId,
    createdUrl: result.newUrl,
  });
});

// redirect the url
const redirectToUrl = catchAsync(async (req, res, next) => {
  const { urlid } = req.params;

  const entry = await urlServices.findAndUpdateUrl(urlid);

  if (!entry) {
    return res.status(404).render("404", { message: "url not found" });
  }

  res.redirect(entry.redirectUrl);
});

export { homePage, createShortUrl, redirectToUrl };
