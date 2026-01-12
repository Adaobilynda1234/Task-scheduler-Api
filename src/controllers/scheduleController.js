const Schedule = require("../models/Schedule");
const Task = require("../models/Task");
const Log = require("../models/Log");
const { createResponse, formatDateTime } = require("../utils/helpers");
const logger = require("../utils/logger");

exports.getSchedulesByTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;

    // Verify task ownership
    const isOwner = await Task.verifyOwnership(taskId, userId);
    if (!isOwner) {
      return res.status(404).json(createResponse(false, "Task not found"));
    }

    const schedules = await Schedule.findByTaskId(taskId);

    res.json(
      createResponse(true, "Schedules retrieved successfully", { schedules })
    );
  } catch (error) {
    next(error);
  }
};

exports.getUpcomingSchedules = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;

    const schedules = await Schedule.getUpcomingSchedules(userId, limit);

    res.json(
      createResponse(true, "Upcoming schedules retrieved successfully", {
        schedules,
      })
    );
  } catch (error) {
    next(error);
  }
};

exports.updateSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { scheduled_time } = req.body;
    const userId = req.user.id;

    // Get schedule to verify ownership
    const schedule = await Schedule.findById(id);
    if (!schedule) {
      return res.status(404).json(createResponse(false, "Schedule not found"));
    }

    // Verify task ownership
    const task = await Task.findById(schedule.task_id);
    if (task.user_id !== userId) {
      return res.status(403).json(createResponse(false, "Access denied"));
    }

    // Check if already executed
    if (schedule.executed) {
      return res
        .status(400)
        .json(createResponse(false, "Cannot update an executed schedule"));
    }

    const updated = await Schedule.updateById(id, {
      scheduled_time: formatDateTime(scheduled_time),
    });

    if (!updated) {
      return res.status(404).json(createResponse(false, "Schedule not found"));
    }

    // Update task status back to scheduled
    await Task.updateById(schedule.task_id, { status: "scheduled" });

    // Log update
    await Log.create({
      task_id: schedule.task_id,
      schedule_id: id,
      action: "schedule_updated",
      status: "success",
      message: `Schedule updated to ${new Date(
        scheduled_time
      ).toLocaleString()}`,
      email_sent: false,
    });

    const updatedSchedule = await Schedule.findById(id);

    logger.info(`Schedule ${id} updated by user ${userId}`);

    res.json(
      createResponse(true, "Schedule updated successfully", {
        schedule: updatedSchedule,
      })
    );
  } catch (error) {
    next(error);
  }
};

exports.deleteSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Get schedule to verify ownership
    const schedule = await Schedule.findById(id);
    if (!schedule) {
      return res.status(404).json(createResponse(false, "Schedule not found"));
    }

    // Verify task ownership
    const task = await Task.findById(schedule.task_id);
    if (task.user_id !== userId) {
      return res.status(403).json(createResponse(false, "Access denied"));
    }

    const deleted = await Schedule.deleteById(id);

    if (!deleted) {
      return res.status(404).json(createResponse(false, "Schedule not found"));
    }

    logger.info(`Schedule ${id} deleted by user ${userId}`);

    res.json(createResponse(true, "Schedule deleted successfully"));
  } catch (error) {
    next(error);
  }
};

exports.getTaskLogs = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 50;

    // Verify task ownership
    const isOwner = await Task.verifyOwnership(taskId, userId);
    if (!isOwner) {
      return res.status(404).json(createResponse(false, "Task not found"));
    }

    const logs = await Log.findByTaskId(taskId, limit);
    const stats = await Log.getStatsByTaskId(taskId);

    res.json(
      createResponse(true, "Logs retrieved successfully", { logs, stats })
    );
  } catch (error) {
    next(error);
  }
};

exports.getUserLogs = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 50;

    const logs = await Log.findByUserId(userId, limit);

    res.json(createResponse(true, "Logs retrieved successfully", { logs }));
  } catch (error) {
    next(error);
  }
};
