
// src/Utils/errorHandling.utils.js
export const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.cause || 500;
  const errorMessage = err.message || "Something went wrong";

  return res.status(statusCode).json({
    success: false,
    message: errorMessage,
    error: err.name || "ServerError",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
