import { body, validationResult } from "express-validator";

export const validateLogin = [
  body("email")
    .notEmpty()
    .withMessage("please enter your name")
    .isEmail()
    .withMessage("please enter email address"),

  body("password")
    .notEmpty()
    .withMessage("please enter your password to login"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("authentication/login", {
        status: "error",
        title: "Some error occured",
        message: errors.array()[0].msg,
      });
    }

    next();
  },
];
