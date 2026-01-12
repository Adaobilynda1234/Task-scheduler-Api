const nodemailer = require("nodemailer");
const logger = require("../utils/logger");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Verify transporter configuration
transporter
  .verify()
  .then(() => {
    logger.info("Email transporter is ready to send emails");
  })
  .catch((err) => {
    logger.error("Email transporter verification failed:", err.message);
  });

module.exports = transporter;
