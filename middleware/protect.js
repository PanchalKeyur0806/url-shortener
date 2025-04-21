import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

const protect = catchAsync(async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next(
      new AppError("your are not logged in please login and try again", 401)
    );
  }

  const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

  if (!decode) {
    return next(new AppError("token invalid", 404));
  }

  const user = await User.findById(decode.id);
  if (!user) {
    return next(new AppError("user does not exists", 404));
  }

  req.user = user;

  next();
});

export { protect };
