export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.render("error", {
        title: "Error message",
        statusCode: 403,
        message: "you don't have a permission to perform this action",
      });
    }

    next();
  };
};
