const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/scheduleController");
const authMiddleware = require("../middleware/auth");
const {
  scheduleUpdateValidation,
  idParamValidation,
} = require("../middleware/validators");

// All routes require authentication
router.use(authMiddleware);

/**
 * @route   GET /api/schedules/upcoming
 * @desc    Get upcoming schedules for user
 * @access  Private
 */
router.get("/upcoming", scheduleController.getUpcomingSchedules);

/**
 * @route   GET /api/schedules/task/:taskId
 * @desc    Get all schedules for a specific task
 * @access  Private
 */
router.get(
  "/task/:taskId",
  idParamValidation,
  scheduleController.getSchedulesByTask
);

/**
 * @route   GET /api/schedules/logs/:taskId
 * @desc    Get execution logs for a task
 * @access  Private
 */
router.get("/logs/:taskId", idParamValidation, scheduleController.getTaskLogs);

/**
 * @route   GET /api/schedules/logs
 * @desc    Get all execution logs for user
 * @access  Private
 */
router.get("/logs", scheduleController.getUserLogs);

/**
 * @route   PUT /api/schedules/:id
 * @desc    Update schedule time
 * @access  Private
 */
router.put(
  "/:id",
  idParamValidation,
  scheduleUpdateValidation,
  scheduleController.updateSchedule
);

/**
 * @route   DELETE /api/schedules/:id
 * @desc    Delete a schedule
 * @access  Private
 */
router.delete("/:id", idParamValidation, scheduleController.deleteSchedule);

module.exports = router;
