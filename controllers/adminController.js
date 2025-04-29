import dotenv from "dotenv";
import {
  getDailyRevenue,
  getTotalUrls,
  getTotalUsers,
} from "../services/adminStatsServices.js";
import catchAsync from "../utils/catchAsync.js";

dotenv.config({ path: "config.env" });

const monthlyPrice = process.env.STRIPE_MONTHLY_PRICE_ID;
const yearlyPrice = process.env.STRIPE_YEARLY_PRICE_ID;

const rendrAdminDashboard = catchAsync(async (req, res) => {
  const [data, totalUsers, totalUrls] = await Promise.all([
    getDailyRevenue(),
    getTotalUsers(),
    getTotalUrls(),
  ]);

  res.render("admin/adminDashboard", {
    title: "Admin Dashboard - url shortener",
    data,
    totalUsers,
    totalUrls,
  });
});

export { rendrAdminDashboard };
