require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const db = require("./src/config/database");
const logger = require("./src/utils/logger");
const errorHandler = require("./src/middleware/errorHandler");
const cronService = require("./src/services/cronService");

// Import routes
const authRoutes = require("./src/routes/auth");
const taskRoutes = require("./src/routes/tasks");
const scheduleRoutes = require("./src/routes/schedules");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
// CORS is disabled - uncomment the lines below to enable CORS
// app.use(cors({
//   origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
//   credentials: true
// }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Task Scheduler API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/schedules", scheduleRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Test database connection
db.getConnection()
  .then((connection) => {
    logger.info("Database connection established successfully");
    connection.release();

    // Start cron service
    cronService.start();
    logger.info("Cron service started");

    // Start server
    app.listen(PORT, () => {
      logger.info(
        `Server running on port ${PORT} in ${process.env.NODE_ENV} mode`
      );
    });
  })
  .catch((err) => {
    logger.error("Unable to connect to database:", err);
    process.exit(1);
  });

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down gracefully");
  cronService.stop();
  db.end()
    .then(() => {
      logger.info("Database connections closed");
      process.exit(0);
    })
    .catch((err) => {
      logger.error("Error closing database connections:", err);
      process.exit(1);
    });
});

module.exports = app;
