const errorHandler = (err, req, res, next) => {
  let { message, statusCode } = err;

  console.log("Error name ", err);

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  statusCode = statusCode || 500;
  message = message || "Internal server error";

  res.status(statusCode).json({
    status: "fail",
    message,
  });
};

export default errorHandler;
