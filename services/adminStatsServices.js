import User from "../models/userModel.js";
import Url from "../models/urlModel.js";

const priceMap = {
  price_1RHNXoCEBeUXy0V2y9tQckfz: 99,
  price_1RHNYYCEBeUXy0V2cEdEoNV0: 999,
};

// get daily revenue
export const getDailyRevenue = async () => {
  const salesData = await User.aggregate([
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          priceId: "$stripePriceId",
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.date": 1 },
    },
  ]);
  const dailyRevenue = [];

  salesData.forEach((entry) => {
    const { date, priceId } = entry._id;
    const price = priceMap[priceId] || 0;

    const revenue = entry.count * price;

    if (!dailyRevenue[date]) {
      dailyRevenue[date] = { date, totalRevenue: 0 };
    }

    dailyRevenue[date].totalRevenue += revenue;
  });

  return Object.values(dailyRevenue);
};

// get total users

export const getTotalUsers = async () => {
  const totalUsers = await User.aggregate([
    {
      $group: {
        _id: null,
        userCount: { $sum: 1 },
      },
    },
  ]);

  return totalUsers;
};

// get total urls
export const getTotalUrls = async () => {
  const totalUrls = await Url.aggregate([
    {
      $group: {
        _id: null,
        totalUrls: { $sum: 1 },
      },
    },
  ]);

  return totalUrls;
};
