const transporter = require("../config/email");
const logger = require("../utils/logger");
const {
  taskExecutedTemplate,
  taskScheduledTemplate,
  welcomeTemplate,
} = require("../templates/emailTemplates");

class EmailService {
  static async sendTaskExecutedEmail(to, data) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to,
        subject: `Task Executed: ${data.taskTitle}`,
        html: taskExecutedTemplate(data),
      };

      const info = await transporter.sendMail(mailOptions);
      logger.info(`Task executed email sent to ${to}`, {
        messageId: info.messageId,
      });
      return true;
    } catch (error) {
      logger.error(`Failed to send task executed email to ${to}:`, error);
      return false;
    }
  }

  static async sendTaskScheduledEmail(to, data) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to,
        subject: `Task Scheduled: ${data.taskTitle}`,
        html: taskScheduledTemplate(data),
      };

      const info = await transporter.sendMail(mailOptions);
      logger.info(`Task scheduled email sent to ${to}`, {
        messageId: info.messageId,
      });
      return true;
    } catch (error) {
      logger.error(`Failed to send task scheduled email to ${to}:`, error);
      return false;
    }
  }

  static async sendWelcomeEmail(to, data) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to,
        subject: "Welcome to Task Scheduler!",
        html: welcomeTemplate(data),
      };

      const info = await transporter.sendMail(mailOptions);
      logger.info(`Welcome email sent to ${to}`, { messageId: info.messageId });
      return true;
    } catch (error) {
      logger.error(`Failed to send welcome email to ${to}:`, error);
      return false;
    }
  }

  static async sendCustomEmail(to, subject, htmlContent) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html: htmlContent,
      };

      const info = await transporter.sendMail(mailOptions);
      logger.info(`Custom email sent to ${to}`, { messageId: info.messageId });
      return true;
    } catch (error) {
      logger.error(`Failed to send custom email to ${to}:`, error);
      return false;
    }
  }
}

module.exports = EmailService;
