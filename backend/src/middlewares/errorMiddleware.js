export const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const success = false;

  res.status(statusCode).json({
    success,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
