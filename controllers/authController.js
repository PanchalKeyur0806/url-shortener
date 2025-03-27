// installed modules
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// custom modules
import app from "../index.js";
import User from "../models/userModel.js";

// error handling
import AppError from "../utils/appError.js";
import catchAsync from "../../../backend/utils/catchAsync.js";

// config file configuration
dotenv.config({ path: "./config.env" });

// function for creating the jwt token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// register function for registering the user
const register = catchAsync(async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password) {
    return next(
      new AppError(
        400,
        "please provie name, email and password filed correctly"
      )
    );
  }

  const newUser = await User.create({
    name,
    email,
    password,
    confirmPassword,
  });

  const token = signToken(newUser._id);

  res.status(200).json({
    status: "success",
    token: token,
    data: newUser,
  });
});

// login the user
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new AppError("Please provide email or password filed correctly", 400)
    );
  }
});

// exporting all functions
export { register };
