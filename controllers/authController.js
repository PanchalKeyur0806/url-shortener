import app from "../index.js";
import User from "../models/userModel.js";

import AppError from "../utils/appError.js";
import catchAsync from "../../../backend/utils/catchAsync.js";

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

  res.status(200).json({
    status: "success",
    data: newUser,
  });
});

export { register };
