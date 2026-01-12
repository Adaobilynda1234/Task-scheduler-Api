require("dotenv").config();
const nodemailer = require("nodemailer");

console.log("Testing email configuration...");
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log(
  "EMAIL_PASSWORD:",
  process.env.EMAIL_PASSWORD ? "Set (hidden)" : "NOT SET!"
);
console.log("EMAIL_HOST:", process.env.EMAIL_HOST);
console.log("EMAIL_PORT:", process.env.EMAIL_PORT);

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

console.log("\nVerifying connection to Gmail...");
transporter
  .verify()
  .then(() => {
    console.log("SUCCESS! Email configuration is valid.");

    console.log("\nSending test email...");
    return transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Test Email - Task Scheduler API",
      html: "<h1>Success!</h1><p>Your email configuration works!</p>",
    });
  })
  .then((info) => {
    console.log("SUCCESS! Test email sent!");
    console.log("Message ID:", info.messageId);
    console.log("\nCheck your inbox:", process.env.EMAIL_USER);
  })
  .catch((error) => {
    console.error("\nERROR:", error.message);

    if (error.message.includes("Invalid login")) {
      console.log("\nPROBLEM: Invalid App Password");
      console.log("SOLUTION:");
      console.log("1. Go to: https://myaccount.google.com/apppasswords");
      console.log("2. Generate new App Password");
      console.log("3. Copy 16 characters (no spaces)");
      console.log("4. Update .env file");
    }

    if (error.message.includes("getaddrinfo")) {
      console.log("\nPROBLEM: Cannot reach Gmail servers");
      console.log("SOLUTION: Check your internet connection");
    }
  });
