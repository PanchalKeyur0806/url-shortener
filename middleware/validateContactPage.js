import { body, validationResult } from "express-validator";

export const validateContactPage = [
  body("subject")
    .isString()
    .withMessage("please enter a string value in the filed")
    .notEmpty()
    .withMessage("please enter subject in the input filed"),
  body("message")
    .isString()
    .withMessage("please enter a string value in the filed")
    .notEmpty()
    .withMessage("please enter message in the input filed"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("contact", {
        status: "error",
        title: "Some error occured",
        message: errors.array()[0].msg,
        data: null,
      });
    }

    next();
  },
];
