import { Plan } from "../models/planModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

const createFreePlan = catchAsync(async (req, res, next) => {
  const freePlan = await Plan.findOne({ name: "free" });
  if (freePlan) {
    return res.status(200).json({
      status: "success",
      message: "free plan already existed",
    });
  }

  const newFreePlan = await Plan.create({
    name: "free",
    price: 0,
    durationInDays: 30,
    urlLimit: 10,
    apiAccess: true,
    description: "Basic free plan with url shorting",
  });

  return { newFreePlan };
});

export { createFreePlan };
