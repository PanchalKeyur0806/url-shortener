import { body, validationResult } from "express-validator";

export const validateUrl = [
  body("url")
    .isString()
    .withMessage("please enter a string value in the filed")
    .notEmpty()
    .withMessage("please enter url in the input filed")
    .isURL()
    .withMessage("Invalid url format"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("index", {
        status: "error",
        title: "Some error occured",
        message: errors.array()[0].msg,
        data: null,
      });
    }

    next();
  },
];
