import { nanoid } from "nanoid";
import Url from "../models/urlModel.js";
import User from "../models/userModel.js";
import AppError from "../utils/appError.js";

// create a short url
export const createShortUrl = async (originalUrl, userid) => {
  const shortID = nanoid(10);
  const user = await User.findById(userid).populate("plan");

  if (user.remainingUrls <= 0) {
    throw new AppError(
      "your url limit is expired, please upgrade the plan to continue",
      400
    );
  }

  const newUrl = await Url.create({
    shortId: shortID,
    redirectUrl: originalUrl,
    userId: userid,
    visitHistory: [],
  });

  user.urls.push(newUrl._id);
  user.remainingUrls -= 1;
  await user.save();

  return {
    shortId: shortID,
    originalUrl,
    newUrl,
  };
};

// url redirection
export const findAndUpdateUrl = async (shortId) => {
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

  return entry;
};
