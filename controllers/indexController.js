import { nanoid } from "nanoid";
import catchAsync from "../utils/catchAsync.js";
import Url from "../models/urlModel.js";
import AppError from "../utils/appError.js";
import * as urlServices from "../services/urlServices.js";
import User from "../models/userModel.js";

const homePage = (req, res) => {
  res.render("index", {
    status: "initial",
    title: "Home page - url shortner",
    message: "",
    url: "",
    id: "",
    createdUrl: null,
  });
};

const createShortUrl = catchAsync(async (req, res, next) => {
  try {
    const { url } = req.body;

    const result = await urlServices.createShortUrl(url, req.user._id);

    const shortUrl = `${req.protocol}://${req.get("host")}/${result.shortId}`;

    res.render("index", {
      status: "success",
      title: "Home page - url shortner",
      message: "url created successfully",
      url: shortUrl,
      id: result.shortId,
      createdUrl: result.newUrl,
    });
  } catch (error) {
    res.render("index", {
      status: "error",
      title: "Home page - url shortner",
      message: error.message,
      url: null,
      id: null,
      createdUrl: null,
    });
  }
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
