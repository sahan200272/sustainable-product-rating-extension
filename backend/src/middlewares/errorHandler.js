const errorHandler = (err, req, res, next) => {

  // This prints the full error stack in your terminal for debugging.
  console.error(err.stack);
  
  const statusCode = err.statusCode || err.status || 500;
  
  res.status(statusCode).json({
    success: false,
    error: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
};

export default errorHandler;
