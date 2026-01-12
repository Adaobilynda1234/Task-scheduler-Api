const Task = require("../models/Task");
const Schedule = require("../models/Schedule");
const Log = require("../models/Log");
const User = require("../models/User");
const EmailService = require("../services/emailService");
const { createResponse, formatDateTime } = require("../utils/helpers");
const logger = require("../utils/logger");

exports.createTask = async (req, res, next) => {
  try {
    const { title, description, scheduled_time } = req.body;
    const userId = req.user.id;

    // Create task
    const taskId = await Task.create({
      user_id: userId,
      title,
      description,
    });

    // Create schedule
    const scheduleId = await Schedule.create({
      task_id: taskId,
      scheduled_time: formatDateTime(scheduled_time),
    });

    // Get user info for email
    const user = await User.findById(userId);

    // Send scheduled confirmation email (don't wait)
    EmailService.sendTaskScheduledEmail(user.email, {
      userName: user.name,
      taskTitle: title,
      taskDescription: description,
      scheduledTime: new Date(scheduled_time).toLocaleString(),
    }).catch((err) => logger.error("Failed to send scheduled email:", err));

    // Log task creation
    await Log.create({
      task_id: taskId,
      schedule_id: scheduleId,
      action: "task_created",
      status: "success",
      message: `Task "${title}" created and scheduled`,
      email_sent: false,
    });

    const task = await Task.findById(taskId);
    const schedule = await Schedule.findById(scheduleId);

    logger.info(`Task created by user ${userId}: ${title}`);

    res.status(201).json(
      createResponse(true, "Task created successfully", {
        task,
        schedule,
      })
    );
  } catch (error) {
    next(error);
  }
};

exports.getTasks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const tasks = await Task.findByUserId(userId);

    res.json(createResponse(true, "Tasks retrieved successfully", { tasks }));
  } catch (error) {
    next(error);
  }
};

exports.getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json(createResponse(false, "Task not found"));
    }

    // Verify ownership
    if (task.user_id !== userId) {
      return res.status(403).json(createResponse(false, "Access denied"));
    }

    // Get schedules for this task
    const schedules = await Schedule.findByTaskId(id);

    res.json(
      createResponse(true, "Task retrieved successfully", {
        task,
        schedules,
      })
    );
  } catch (error) {
    next(error);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { title, description, status } = req.body;

    // Verify ownership
    const isOwner = await Task.verifyOwnership(id, userId);
    if (!isOwner) {
      return res.status(404).json(createResponse(false, "Task not found"));
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json(createResponse(false, "No fields to update"));
    }

    const updated = await Task.updateById(id, updateData);

    if (!updated) {
      return res.status(404).json(createResponse(false, "Task not found"));
    }

    // Log update
    await Log.create({
      task_id: id,
      action: "task_updated",
      status: "success",
      message: `Task updated`,
      email_sent: false,
    });

    const task = await Task.findById(id);

    logger.info(`Task ${id} updated by user ${userId}`);

    res.json(createResponse(true, "Task updated successfully", { task }));
  } catch (error) {
    next(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify ownership
    const isOwner = await Task.verifyOwnership(id, userId);
    if (!isOwner) {
      return res.status(404).json(createResponse(false, "Task not found"));
    }

    const deleted = await Task.deleteById(id);

    if (!deleted) {
      return res.status(404).json(createResponse(false, "Task not found"));
    }

    logger.info(`Task ${id} deleted by user ${userId}`);

    res.json(createResponse(true, "Task deleted successfully"));
  } catch (error) {
    next(error);
  }
};
