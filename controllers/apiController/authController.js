// installed modules
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// custom modules
import User from "../../models/userModel.js";

// error handling
import AppError from "../../utils/appError.js";
import catchAsync from "../../utils/catchAsync.js";
import * as authService from "../../services/authServices.js";

// config file configuration
dotenv.config({ path: "../config.env" });

// function for creating the jwt token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// register function for registering the user
const register = catchAsync(async (req, res, next) => {
  const { user, token } = await authService.registration(req.body);

  res.cookie("jwt", token, {
    httpOnly: true,
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
  });

  res.status(200).json({
    status: "success",
    token: token,
    data: user,
  });
});

// login the user
const login = catchAsync(async (req, res, next) => {
  const { user, token } = await authService.loginUser(req.body);

  res.cookie("jwt", token, {
    httpOnly: true,
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

const logout = catchAsync(async (req, res, next) => {
  if (!req.cookies || !req.cookies.jwt) {
    return next(new AppError("cookie not found", 400));
  }

  res.clearCookie("jwt", {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
  });

  res.status(200).json({
    status: "success",
    message: "logout successfully",
  });
});

// protect route
const protect = catchAsync(async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new AppError("please login to get access this page", 404));
  }

  const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const user = await User.findById(decode.id);
  if (!user) {
    return next(new AppError("user not exists", 400));
  }

  req.user = user;
  next();
});

// exporting all functions
export { register, login, logout, protect };
