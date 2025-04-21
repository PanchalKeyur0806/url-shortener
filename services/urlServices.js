import { nanoid } from "nanoid";
import Url from "../models/urlModel.js";
import User from "../models/userModel.js";
import AppError from "../utils/appError.js";

// create a short url
export const createShortUrl = async (originalUrl, userid) => {
  const shortID = nanoid(10);
  const user = await User.findById(userid).populate("plan");

  // get today and end date for free-plan model
  const todayDate = new Date();
  const endDate = new Date(user.planEndDate);

  // calculate the reamining days
  const remainingDays = Math.ceil(
    (endDate - todayDate) / (1000 * 60 * 60 * 24)
  );

  // check the remaining urls
  if (user.remainingUrls <= 0) {
    throw new AppError(
      "your url limit is expired, please upgrade the plan to continue",
      400
    );
  }

  // check the remainingDays
  if (user.remainingDays <= 0) {
    throw new AppError(
      "your url service is expired, please upgrade the plan to continue",
      400
    );
  }

  // create the new url
  const newUrl = await Url.create({
    shortId: shortID,
    redirectUrl: originalUrl,
    userId: userid,
    visitHistory: [],
  });

  // added url in user documents
  user.urls.push(newUrl._id);

  // update the users remaining days and urls
  user.remainingDays = remainingDays > 0 ? remainingDays : 0;
  user.remainingUrls -= 1;
  await user.save();

  // return the url object
  return {
    shortId: shortID,
    originalUrl,
    newUrl,
  };
};

// url redirection
export const findAndUpdateUrl = async (shortId) => {
  // find url by short id and update the visitHistory
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

  //  return the entry
  return entry;
};
