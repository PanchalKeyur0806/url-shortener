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
  const features = new AppFeatures(
    User.find().populate("plan"),
    req.query
  ).search();

  let allUsers = await features.query.select("-password");

  // Post-processing for plan searches
  if (req.query.search && req.query.search.includes(":")) {
    const [field, value] = req.query.search
      .split(":")
      .map((item) => item.trim());

    if (field === "plan") {
      // Filter users whose populated plan is null (didn't match the criteria)
      allUsers = allUsers.filter((user) => user.plan !== null);
    }
  } else if (req.query.search) {
    // For general search terms, also check plan names
    const keyword = req.query.search.trim();
    const filteredByPlan = allUsers.filter(
      (user) =>
        user.plan &&
        user.plan.name &&
        user.plan.name.toLowerCase().includes(keyword.toLowerCase())
    );

    // Find users who either matched the initial query OR have matching plan names
    const userIds = new Set();
    allUsers.forEach((user) => userIds.add(user._id.toString()));

    filteredByPlan.forEach((user) => {
      if (!userIds.has(user._id.toString())) {
        allUsers.push(user);
      }
    });
  }

  res.status(200).render("admin/userDashboard", {
    title: "User dashboard - url shortener",
    users: allUsers,
  });
});
export { rendrAdminDashboard, renderUserDashboard };
