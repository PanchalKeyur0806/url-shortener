import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import * as authServices from "../services/authServices.js";

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
const renderProfile = catchAsync(async (req, res, next) => {
  const currentUser = req.user;

  res.render("profile", {
    title: "Profile page - url shortner",
    status: null,
    message: null,
    user: currentUser,
  });
});

// change the profile information based on the user input
const changeProfile = catchAsync(async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    const currentUser = req.user;

    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (password) {
      if (password !== confirmPassword) {
        return next(new AppError("password does not match", 400));
      }

      updates.password = await bcrypt.hash(password, 10);
    }

    const updateUser = await User.findByIdAndUpdate(currentUser._id, updates, {
      new: true,
      runValidators: true,
    });

    res.render("profile", {
      title: "Profile - url shortner",
      status: "success",
      message: "Profile updated successfully",
      data: updateUser,
      user: currentUser,
    });
  } catch (error) {
    res.render("profile", {
      title: "Profile - url shortner",
      status: "error",
      message: error.message,
    });
  }
});

export {
  renderRegisterPage,
  handleRegistration,
  renderLoginPage,
  handleLogin,
  handleLogout,
  renderProfile,
  changeProfile,
};
