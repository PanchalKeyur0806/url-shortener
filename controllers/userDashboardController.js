// installed models
import moment from "moment-timezone";
// custom modules
import Url from "../models/urlModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import User from "../models/userModel.js";

// render user dashboard
const renderDashboard = catchAsync(async (req, res) => {
  // get the logged in user
  const currentUser = req.user;
  // find the urls according to the users
  const usersURl = await Url.find({ userId: currentUser });
  if (!usersURl) {
    return next(new AppError("There is no url created by that user", 404));
  }

  // return a array of objects with ist timezone
  const urlWithIst = usersURl.map((item) => {
    return {
      ...item._doc,
      clicked: item.visitHistory.length,
      originalUrl: `${req.protocol}://${req.get("host")}/${item.shortId}`,
      createdAtIst: moment(item.createdAt)
        .tz("Asia/Kolkata")
        .format("DD-MM-YYYY hh:mm A"),
    };
  });

  // render the website
  res.render("userDashboard/dashboard", {
    title: "user dashboard - url shortener",
    data: urlWithIst,
    req,
  });
});

const userSubscription = catchAsync(async (req, res, next) => {
  // get the logged in user
  const currentUser = req.user;
  if (currentUser.stripeSubcriptionId === null) {
    return next(new AppError("you haven't purchased any subscription", 404));
  }

  // give the user plan and end date of the plan
  const usersPlan = await User.findById(currentUser._id).populate("plan");
  const endDate = usersPlan.planEndDate;

  // get user subscription id and plan name
  const userSubscription = currentUser.stripeSubcriptionId;
  const currentPlan = currentUser.plan.name;

  // set a renew Date
  const renewDate = endDate.setDate(endDate.getDate() + 1);
  const nextBillingDate = new Date(1777270512257);

  res.render("userDashboard/subscription", {
    title: "user subscription",
    userSubscription,
    currentPlan,
    nextBillingDate,
  });
});
export { renderDashboard, userSubscription };
