import dotenv from "dotenv";
import {
  getDailyRevenue,
  getTotalUrls,
  getTotalUsers,
} from "../services/adminStatsServices.js";

import { getWeeklyStats } from "../utils/getWeeklyStats.js";
import User from "../models/userModel.js";

import catchAsync from "../utils/catchAsync.js";
import Url from "../models/urlModel.js";

dotenv.config({ path: "config.env" });

const monthlyPrice = process.env.STRIPE_MONTHLY_PRICE_ID;
const yearlyPrice = process.env.STRIPE_YEARLY_PRICE_ID;

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
  });
});

export { rendrAdminDashboard };
