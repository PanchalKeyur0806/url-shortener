// installed modules
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// custom modules
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

  res.cookie("jwt", token, {
    httpOnly: true,
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
  });

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

  const user = await User.findOne({ email });
  if (!user) {
    return next(
      new AppError(
        "email id not found, please register first and try again",
        400
      )
    );
  }

  if (!(await user.correctPassword(password, user.password))) {
    return next(
      new AppError(
        "password does not match, please enter correct password",
        400
      )
    );
  }

  const token = signToken(user._id);

  res.cookie("jwt", token, {
    httpOnly: false,
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
  });

  res.status(200).json({
    status: "success",
    token,
    user,
  });
});

// exporting all functions
export { register, login };
