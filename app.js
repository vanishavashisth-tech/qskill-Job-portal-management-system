// src/app.js
// Configures the Express application: middleware, routes, and error handling.
// Does NOT start the server — that happens in server.js.

const express = require("express");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const { errorHandler, notFoundHandler } = require("./middleware/errorMiddleware");

const app = express();

// Parse incoming JSON request bodies
app.use(express.json());

// Simple health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Job Portal Management API is running",
  });
});

// Feature routes
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

// 404 handler for unmatched routes
app.use(notFoundHandler);

// Centralized error handler (must be the last middleware)
app.use(errorHandler);

module.exports = app;
