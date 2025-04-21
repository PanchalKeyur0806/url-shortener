import { nanoid } from "nanoid";
import Url from "../models/urlModel.js";

// create a short url
export const createShortUrl = async (originalUrl, userid) => {
  const shortID = nanoid(10);

  const newUrl = await Url.create({
    shortId: shortID,
    redirectUrl: originalUrl,
    userId: userid,
    visitHistory: [],
  });

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
