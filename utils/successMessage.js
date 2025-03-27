const successMessage = (res, statusCode, message) => {
  return res.status(statusCode).json({
    status: "success",
    message,
  });
};

export default successMessage;
