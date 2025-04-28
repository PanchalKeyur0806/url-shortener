import { body, validationResult } from "express-validator";

export const validateRegisters = [
  body("name")
    .isString()
    .withMessage("please enter correct name")
    .notEmpty()
    .withMessage("please enter name filed"),

  body("email")
    .isEmail()
    .withMessage("please enter correct email id")
    .notEmpty()
    .withMessage("please provide correct email id"),

  body("password").notEmpty().withMessage("please enter your password"),

  body("confirmPassword")
    .notEmpty()
    .withMessage("please enter confirmPassword correctly"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("authentication/register", {
        status: "error",
        title: "Some error occured",
        message: errors.array()[0].msg,
      });
    }

    next();
  },
];
