// installed models
import moment from "moment-timezone";
// custom modules
import Url from "../models/urlModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

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

export { renderDashboard };
