import dotenv from "dotenv";
import {
  getDailyRevenue,
  getTotalUrls,
  getTotalUsers,
  getUrlRecentActivity,
  getUserRecentActivity,
} from "../services/adminStatsServices.js";

import { getWeeklyStats } from "../utils/getWeeklyStats.js";
import User from "../models/userModel.js";

import catchAsync from "../utils/catchAsync.js";
import Url from "../models/urlModel.js";
import moment from "moment-timezone";

dotenv.config({ path: "config.env" });

const rendrAdminDashboard = catchAsync(async (req, res) => {
  const [data, totalUsers, totalUrls] = await Promise.all([
    getDailyRevenue(),
    getTotalUsers(),
    getTotalUrls(),
  ]);

  // get weekly url status
  let urlStatsAndData = await getWeeklyStats(Url);

  const urlLabels = urlStatsAndData.map((item) => item.week);
  const urlData = urlStatsAndData.map((item) => item.percentage);

  // latest report for the Url
  const latestData = urlStatsAndData.sort((a, b) => {
    if (a.year === b.year) {
      return b.week - a.week;
    }

    return b.year - a.year;
  })[0];

  // get weekly user status
  let userStatsData = await getWeeklyStats(User);

  const userLabels = userStatsData.map((item) => item.week);
  const userData = userStatsData.map((item) => item.percentage);

  const userLatestData = userStatsData.sort((a, b) => {
    if (a.year === b.year) {
      return b.week - a.week;
    }

    return b.year - b.year;
  })[0];

  // get recent url activity
  const latestUrlActivity = await getUrlRecentActivity(Url, 3);
  const formatedUrlActivity = latestUrlActivity[0]?.data.map((item) => {
    return {
      ...item,
      date: moment(item.date).tz("Asia/Kolkata").format("DD-MM-YYYY hh:mm A"),
    };
  });

  // get recent usres activity
  const latestUserActivity = await getUserRecentActivity(User, 5);
  const formatedUsersActivity = latestUserActivity[0]?.data.map((item) => {
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

const renderUserDashboard = catchAsync(async (req, res, next) => {
  const getAllUsers = await User.find().populate("plan").select("-password");

  console.log(getAllUsers);

  res.status(200).render("admin/userDashboard", {
    title: "User dashboard - url shortener",
    users: getAllUsers,
  });
});
export { rendrAdminDashboard, renderUserDashboard };
