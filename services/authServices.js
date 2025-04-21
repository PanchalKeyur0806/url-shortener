import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/userModel.js";
import AppError from "../utils/appError.js";
import { Plan } from "../models/planModel.js";

dotenv.config({ path: "./config.env" });

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

export const registration = async (userData) => {
  const { name, email, password, confirmPassword } = userData;

  const freePlan = await Plan.findOne({ name: "free" });
  if (!freePlan) {
    throw new AppError("free plan does not exists", 404);
  }

  const existsUser = await User.findOne({ email });
  if (existsUser) {
    throw new AppError(
      "user already exists, please enter another emial id",
      400
    );
  }

  const newUser = await User.create({
    name,
    email,
    password,
    confirmPassword,
    plan: freePlan._id,
    planStartDate: new Date(),
    planEndDate: new Date(
      Date.now() + freePlan.durationInDays * 24 * 60 * 60 * 1000
    ),
  });
  const token = signToken(newUser._id);

  return {
    user: newUser,
    token,
  };
};

export const loginUser = async (userData) => {
  const { email, password } = userData;

  const findUser = await User.findOne({ email });
  if (!findUser) {
    throw new AppError("email id does not exists", 400);
  }

  if (!(await findUser.correctPassword(password, findUser.password))) {
    throw new AppError("please enter correct password", 400);
  }

  const token = signToken(findUser._id);

  return {
    user: findUser,
    token,
  };
};
