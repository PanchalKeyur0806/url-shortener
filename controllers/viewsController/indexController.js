import { nanoid } from "nanoid";
import catchAsync from "../../utils/catchAsync.js";
import Url from "../../models/urlModel.js";
import AppError from "../../utils/appError.js";

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
  const shortID = nanoid(10);

  if (!url) {
    return next(new AppError("please enter your url", 400));
  }

  const newUrl = await Url.create({
    shortId: shortID,
    redirectUrl: url,
    visitHistory: [],
  });

  const shortUrl = `${req.protocol}://${req.get("host")}/${shortID}`;

  res.render("index", {
    status: "success",
    message: "url created successfully",
    url: shortUrl,
    id: shortID,
    createdUrl: newUrl,
  });
});

// redirect the url
const redirectToUrl = catchAsync(async (req, res, next) => {
  const { shortId } = req.params;

  const entry = await Url.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: { timestamp: Date.now() },
      },
    },
    {
      new: true,
    }
  );

  if (!entry) {
    return res.status(404).render("404", { message: "url not found" });
  }

  res.redirect(entry.redirectUrl);
});

// authentication
const getRegisterPage = (req, res) => {
  res.render("authentication/register");
};

// login
const getLoginPage = (req, res) => {
  res.render("authentication/login");
};
export {
  homePage,
  createShortUrl,
  getRegisterPage,
  getLoginPage,
  redirectToUrl,
};
