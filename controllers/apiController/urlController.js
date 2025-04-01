import { nanoid } from "nanoid";
import Url from "../../models/urlModel.js";
import catchAsync from "../../utils/catchAsync.js";
import * as urlServices from "../../services/urlServices.js";

// get all existing urls
export const getAllUrls = async (req, res) => {
  const urls = await Url.find();

  res.status(200).json({
    satus: "success",
    urls,
  });
};

// create url
export const createShortUrlApi = catchAsync(async (req, res, next) => {
  const { url } = req.body;

  const result = await urlServices.createShortUrl(url);
  const shortUrl = `${req.protocol}://${req.get("host")}/${result.shortId}`;

  res.status(200).json({
    status: "success",
    message: "url created successfully",
    url: shortUrl,
    id: result.shortId,
    createdUrl: result.newUrl,
  });
});

// get the url and redirect to specific page
export const redirectUrlApi = catchAsync(async (req, res, next) => {
  const { urlId } = req.params;

  const entry = await urlServices.findAndUpdateUrl(urlId);
  if (!entry) {
    return res.status(400).json({
      status: "fail",
      message: "url not found",
    });
  }

  res.status(200).json({
    status: "success",
    redirectUrl: entry.redirectUrl,
  });
});

// generate report about specific shortid
export const generateReport = async (req, res) => {
  const { shortId } = req.params;
  if (!shortId) {
    res
      .status(200)
      .json({ status: "fail", message: "please provide shortid in params" });
  }

  const result = await Url.findOne({ shortId });

  res.status(200).json({
    status: "success",
    timesClicked: result.visitHistory.length,
    info: result,
  });
};
