import dotenv from "dotenv";
import {
  getDailyRevenue,
  getTotalUrls,
  getTotalUsers,
  getUrlRecentActivity,
  getUserRecentActivity,
} from "../services/adminStatsServices.js";

import { getStats } from "../utils/getWeeklyStats.js";
import User from "../models/userModel.js";

import catchAsync from "../utils/catchAsync.js";
import Url from "../models/urlModel.js";
import moment from "moment-timezone";
import AppFeatures from "../utils/AppFeatures.js";
import searchByPopulatedField from "../services/adminSearchHelper.js";
import AppError from "../utils/appError.js";

dotenv.config({ path: "config.env" });

const rendrAdminDashboard = catchAsync(async (req, res) => {
  const [data, totalUsers, totalUrls] = await Promise.all([
    getDailyRevenue(),
    getTotalUsers(),
    getTotalUrls(),
  ]);

  // get weekly url status
  let urlStatsAndData = await getStats(Url, "createdAt", 7, "daily");

  const urlLabels = urlStatsAndData.map((item) => item.day);
  const urlData = urlStatsAndData.map((item) => item.percentage);

  // latest report for the Url
  const latestData = urlStatsAndData.sort((a, b) => {
    if (a.year === b.year) {
      return b.week - a.week;
    }

    return b.year - a.year;
  })[0];

  // get weekly user status
  let userStatsData = await getStats(User, "createdAt", 7, "daily");

  const userLabels = userStatsData.map((item) => item.day);
  const userData = userStatsData.map((item) => item.percentage);

  const userLatestData = userStatsData.sort((a, b) => {
    if (a.year === b.year) {
      return b.week - a.week;
    }

    return b.year - b.year;
  })[0];

  // get recent url activity
  const latestUrlActivity = await getUrlRecentActivity(Url, 3);
  const formatedUrlActivity = latestUrlActivity[0]?.data
    .slice(0, 3)
    .map((item) => {
      return {
        ...item,
        date: moment(item.date).tz("Asia/Kolkata").format("DD-MM-YYYY hh:mm A"),
      };
    });

  // get recent usres activity
  const latestUserActivity = await getUserRecentActivity(User, 5);
  const formatedUsersActivity = latestUserActivity[0]?.data
    .slice(0, 3)
    .map((item) => {
      return {
        ...item,
        date: moment(item.date).tz("Asia/Kolkata").format("DD-MM-YYYY hh:mm A"),
      };
    });

  res.render("admin/adminDashboard", {
    title: "Admin Dashboard - url shortener",
    data,
    totalUsers,
    totalUrls,
    latestData,
    userLatestData,
    labels: JSON.stringify(urlLabels),
    datas: JSON.stringify(urlData),
    // send user stats and data
    userLabels: JSON.stringify(userLabels),
    userData: JSON.stringify(userData),
    // recent activity
    recentUrlData: formatedUrlActivity,
    recentUserData: formatedUsersActivity,
  });
});

// render user dashboard in the controller
const renderUserDashboard = catchAsync(async (req, res, next) => {
  const features = new AppFeatures(User.find().populate("plan"), req.query)
    .search()
    .paginate();

  let allUsers = await features.query.select("-password");

  if (req.query.status) {
    const status = req.query.status;

    if (status === "active") {
      allUsers = allUsers.filter((user) => {
        return user.isActive === true;
      });
    } else if (status === "notactive") {
      allUsers = allUsers.filter((user) => {
        return user.isActive === false;
      });
    } else {
      throw new AppError("Invalid status format", 404);
    }
  }

  // search by role
  if (req.query.role) {
    const role = req.query.role;
    if (role === "user") {
      allUsers = allUsers.filter((user) => {
        return (user.role = "user");
      });
    } else if (role === "admin") {
      allUsers = allUsers.filter((user) => {
        return (user.role = "admin");
      });
    } else {
      throw new AppError("Invalid role type ", 404);
    }
  }

  // pagination
  const limit = parseInt(req.query.limit) || 5;
  const currentPage = parseInt(req.query.page) || 1;
  const totalDocs = await User.countDocuments();
  const totalPages = Math.ceil(totalDocs / limit);
  const pageNo = req.query.page || 1;

  if (currentPage > totalPages && totalPages > 0) {
    return next(new AppError("Requested page does not exist", 404));
  }

  // Post-processing for plan searches
  allUsers = searchByPopulatedField(allUsers, req.query.search, "plan");

  res.status(200).render("admin/userDashboard", {
    title: "User dashboard - url shortener",
    users: allUsers,
    pageNo,
    totalPages,
  });
});

const renderSubscriptionboard = catchAsync(async (req, res, next) => {
  const features = new AppFeatures(User.find().populate("plan"), req.query)
    .search()
    .paginate();

  let allsubscriptions = await features.query.select("-password");

  if (req.query.subscriptionstatus) {
    const subscriptionstatus = req.query.subscriptionstatus;

    if (subscriptionstatus === "active") {
      allsubscriptions = allsubscriptions.filter((user) => {
        return user.stripeSubscriptionStatus === "active";
      });
    } else if (subscriptionstatus === "canceled") {
      allsubscriptions = allsubscriptions.filter((user) => {
        return user.stripeSubscriptionStatus === "canceled";
      });
    } else {
      throw new AppError("Invalid status format", 404);
    }
  }

  // pagination
  const limit = parseInt(req.query.limit) || 5;
  const currentPage = parseInt(req.query.page) || 1;
  const totalDocs = await User.countDocuments();
  const totalPages = Math.ceil(totalDocs / limit);
  const pageNo = req.query.page || 1;

  if (currentPage > totalPages && totalPages > 0) {
    return next(new AppError("Requested page does not exist", 404));
  }

  // Post-processing for plan searches
  allsubscriptions = searchByPopulatedField(
    allsubscriptions,
    req.query.search,
    "plan"
  );

  res.render("admin/subscriptionboard", {
    title: "Admin subscriptionboard - url shortener",
    allsubscriptions,
    pageNo,
    totalPages,
  });
});

const renderUrlDashboard = catchAsync(async (req, res, next) => {
  const allUrls = await Url.find().populate("userId");
  if (!allUrls) {
    return next(new AppError("There is no urls in the database", 404));
  }

  // console.log(allUrls);

  res.render("admin/urlDashboard", {
    title: "Admin urls - url shortener",
    allUrls,
  });
});

export {
  rendrAdminDashboard,
  renderUserDashboard,
  renderSubscriptionboard,
  renderUrlDashboard,
};
