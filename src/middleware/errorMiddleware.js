const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    error: {
      message,
      status: statusCode,
      name: err.name
    }
  });
};
module.exports = errorMiddleware;