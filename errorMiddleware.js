// src/middleware/errorMiddleware.js
// Catches any error passed via next(err) from controllers and
// sends back a consistent JSON error response instead of crashing
// the server or leaking a stack trace to the client.

function errorHandler(err, req, res, next) {
  console.error("Error:", err.message);

  // PostgreSQL foreign key violation (e.g. applying to a job_id that doesn't exist)
  if (err.code === "23503") {
    return res.status(400).json({
      success: false,
      message: "Invalid reference: the related job does not exist",
    });
  }

  // PostgreSQL unique constraint violation
  if (err.code === "23505") {
    return res.status(409).json({
      success: false,
      message: "Duplicate entry: this record already exists",
    });
  }

  // Database connection refused
  if (err.code === "ECONNREFUSED") {
    return res.status(503).json({
      success: false,
      message: "Database connection failed. Please try again later.",
    });
  }

  // Fallback: generic server error
  res.status(500).json({
    success: false,
    message: "Something went wrong on the server",
  });
}

// 404 handler for routes that don't exist at all
function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
}

module.exports = { errorHandler, notFoundHandler };
