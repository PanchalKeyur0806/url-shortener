import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import User from "../models/userModel.js";

export const checkPurchasedPlan = catchAsync(async (req, res, next) => {
  const currentUser = req.user;

  const findUser = await User.findById(currentUser._id);

  if (findUser.stripeSubscriptionStatus === "active") {
    return next(
      new AppError(
        "you can't upgrade the subscription, please wait for your subscription to finish",
        400
      )
    );
  }

  next();
});
