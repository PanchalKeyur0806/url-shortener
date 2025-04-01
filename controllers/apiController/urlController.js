import { nanoid } from "nanoid";
import Url from "../../models/urlModel.js";

// get all existing urls
const getAllUrls = async (req, res) => {
  const urls = await Url.find();

  res.status(200).json({
    satus: "success",
    urls,
  });
};

// create url
const createUrl = async (req, res) => {
  const { url } = req.body;
  const shortID = nanoid(10);

  console.log("short id is ..", shortID);

  if (!url) {
    return res.status(400).json({
      status: "fail",
      message: "please enter url filed",
    });
  }

  const newUrl = await Url.create({
    shortId: shortID,
    redirectUrl: url,
    visitHistory: [],
    // userId: 100,
  });

  res.status(200).json({
    status: "success",
    message: "url created successfully",
    id: shortID,
    createdUrl: newUrl,
  });
};

// get the url and redirect to specific page
const getUrl = async (req, res) => {
  const { urlId } = req.params;
  if (!urlId) {
    res
      .status(400)
      .json({ status: "fail", message: "please provide shortid in params" });
  }

  const entry = await Url.findOneAndUpdate(
    { shortId: urlId },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );

  res.redirect(entry.redirectUrl);
};

// generate report about specific shortid
const generateReport = async (req, res) => {
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

export { getAllUrls, createUrl, getUrl, generateReport };
