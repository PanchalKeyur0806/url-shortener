import dotenv from "dotenv";
import User from "../models/userModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import * as authServices from "../services/authServices.js";
import { title } from "process";
import { log } from "console";

dotenv.config({ path: "./config.env" });

const renderRegisterPage = (req, res) => {
  res.render("authentication/register", {
    newUser: null,
    title: "register - url shortner",
    message: undefined,
    status: "initial",
  });
};

const handleRegistration = catchAsync(async (req, res, next) => {
  try {
    const { role = "user" } = req.body;
    const { user, token } = await authServices.registration(req.body, role);

    res.cookie("jwt", token, {
      httpOnly: true,
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
      ),
    });

    res.redirect("/");
  } catch (error) {
    res.render("authentication/register", {
      title: "register - url shortner",
      status: "error",
      message: error.message,
      data: null,
    });
  }
});

const renderLoginPage = (req, res) => {
  res.render("authentication/login", {
    status: "initial",
    title: "login page - urlshortner",
    message: "",
    data: null,
  });
};

const handleLogin = catchAsync(async (req, res) => {
  try {
    const { user, token } = await authServices.loginUser(req.body);

    res.cookie("jwt", token, {
      httpOnly: true,
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
      ),
    });

    res.redirect("/");
  } catch (err) {
    res.render("authentication/login", {
      title: "login page - urlshortner",
      status: "error",
      message: err.message,
      data: null,
    });
  }
});

const handleLogout = catchAsync(async (req, res, next) => {
  try {
    const jwt = req.cookies.jwt;
    console.log(jwt);

    if (!jwt) {
      return next(new AppError("cookie not found", 404));
    }

    res.clearCookie("jwt");

    res.redirect("/");
  } catch (error) {
    res.render("index", {
      title: "",
      status: "error",
      message: error.message,
      data: null,
    });
  }
});

// display information about the logged in user
const profile = catchAsync(async (req, res, next) => {
  const currentUser = req.user;

  res.render("profile", {
    title: "Profile page - url shortner",
    data: currentUser,
  });
});

export {
  renderRegisterPage,
  handleRegistration,
  renderLoginPage,
  handleLogin,
  handleLogout,
  profile,
};
