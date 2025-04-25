import { Plan } from "../models/planModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { name } from "ejs";

const createFreePlan = catchAsync(async (req, res, next) => {
  const freePlan = await Plan.findOne({ name: "free" });
  if (freePlan) {
    return next(new AppError("free plan already exists", 400));
  }

  const newFreePlan = await Plan.create({
    name: "free",
    price: 0,
    durationInDays: 30,
    urlLimit: 20,
    description: "Basic free plan with limited access and limited usage",
  });

  console.log("free plan is created ", newFreePlan);
});

const monthlyPlan = catchAsync(async (req, res, next) => {
  const monthlPlan = await Plan.findOne({ name: "monthly" });
  if (monthlPlan) {
    return next(new AppError("monthly plan exists", 400));
  }

  const newMonthlyPlan = await Plan.create({
    name: "monthly",
    price: 99,
    durationInDays: 30,
    urlLimit: 100,
    description: "Monthly plan with limited access and limited usage",
  });

  res.status(200).json({
    status: "success",
    message: "mohtly plan created successfully",
  });
});

const yearlyPlan = catchAsync(async (req, res, next) => {
  const yearlyPlan = await Plan.findOne({ name: "yearly" });
  if (yearlyPlan) {
    return next(new AppError("yearly plan exists", 400));
  }

  const newYearlyPlan = await Plan.create({
    name: "yearly",
    price: 999,
    durationInDays: 365,
    urlLimit: 1000,
    description: "Yearly plan with huge url access and longer usage",
  });

  res.status(200).json({
    status: "success",
    description: "yearly plan created successfully",
  });
});

export { createFreePlan, monthlyPlan, yearlyPlan };
