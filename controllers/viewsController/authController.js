import dotenv from "dotenv";
import User from "../../models/userModel.js";
import AppError from "../../utils/appError.js";
import catchAsync from "../../utils/catchAsync.js";
import * as authServices from "../../services/authServices.js";

dotenv.config({ path: "./config.env" });

const renderRegisterPage = (req, res) => {
  res.render("authentication/register", {
    newUser: null,
    message: undefined,
    status: "initial",
  });
};

const handleRegistration = catchAsync(async (req, res, next) => {
  const { user, token } = await authServices.registration(req.body);

  res.cookie("jwt", {
    httpOnly: true,
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
  });

  res.redirect("/");
});

const renderLoginPage = (req, res) => {
  res.render("authentication/login", {
    status: "initial",
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
      status: "error",
      message: err.message,
      data: null,
    });
  }
});

export { renderRegisterPage, handleRegistration, renderLoginPage, handleLogin };
