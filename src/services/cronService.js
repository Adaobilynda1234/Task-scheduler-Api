const cron = require("node-cron");
const Schedule = require("../models/Schedule");
const Task = require("../models/Task");
const Log = require("../models/Log");
const EmailService = require("./emailService");
const logger = require("../utils/logger");

class CronService {
  constructor() {
    this.task = null;
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) {
      logger.warn("Cron service is already running");
      return;
    }

    const cronSchedule = process.env.CRON_SCHEDULE || "*/1 * * * *";

    this.task = cron.schedule(cronSchedule, async () => {
      await this.checkAndExecuteTasks();
    });

    this.isRunning = true;
    logger.info(`Cron service started with schedule: ${cronSchedule}`);
  }

  stop() {
    if (this.task) {
      this.task.stop();
      this.isRunning = false;
      logger.info("Cron service stopped");
    }
  }

  async checkAndExecuteTasks() {
    try {
      logger.info("Checking for pending tasks...");

      // Get all pending schedules that are due
      const pendingSchedules = await Schedule.findPendingSchedules();

      if (pendingSchedules.length === 0) {
        logger.info("No pending tasks found");
        return;
      }

      logger.info(
        `Found ${pendingSchedules.length} pending task(s) to execute`
      );

      // Execute each pending task
      for (const schedule of pendingSchedules) {
        await this.executeTask(schedule);
      }
    } catch (error) {
      logger.error("Error in cron job:", error);
    }
  }

  async executeTask(schedule) {
    const { id, task_id, title, description, email, user_name } = schedule;

    try {
      logger.info(`Executing task #${task_id}: ${title}`);

      // Mark schedule as executed
      await Schedule.markAsExecuted(id);

      // Update task status
      await Task.updateById(task_id, { status: "completed" });

      // Send email notification
      const emailSent = await EmailService.sendTaskExecutedEmail(email, {
        userName: user_name,
        taskTitle: title,
        taskDescription: description,
        executedAt: new Date().toLocaleString(),
        status: "success",
      });

      // Log the execution
      await Log.create({
        task_id,
        schedule_id: id,
        action: "task_executed",
        status: "success",
        message: `Task "${title}" executed successfully`,
        email_sent: emailSent,
      });

      logger.info(
        `Task #${task_id} executed successfully. Email sent: ${emailSent}`
      );
    } catch (error) {
      logger.error(`Failed to execute task #${task_id}:`, error);

      // Update task status to failed
      await Task.updateById(task_id, { status: "failed" });

      // Log the failure
      await Log.create({
        task_id,
        schedule_id: id,
        action: "task_execution_failed",
        status: "failed",
        message: error.message,
        email_sent: false,
      });

      // Send failure notification
      try {
        await EmailService.sendTaskExecutedEmail(email, {
          userName: user_name,
          taskTitle: title,
          taskDescription: description,
          executedAt: new Date().toLocaleString(),
          status: "failed",
        });
      } catch (emailError) {
        logger.error("Failed to send failure notification email:", emailError);
      }
    }
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      schedule: process.env.CRON_SCHEDULE || "*/1 * * * *",
    };
  }
}

// Export a singleton instance
module.exports = new CronService();
