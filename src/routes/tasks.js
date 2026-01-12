const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const authMiddleware = require("../middleware/auth");
const {
  taskValidation,
  taskUpdateValidation,
  idParamValidation,
} = require("../middleware/validators");

// All routes require authentication
router.use(authMiddleware);

/**
 * @route   POST /api/tasks
 * @desc    Create a new task with schedule
 * @access  Private
 */
router.post("/", taskValidation, taskController.createTask);

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks for authenticated user
 * @access  Private
 */
router.get("/", taskController.getTasks);

/**
 * @route   GET /api/tasks/:id
 * @desc    Get task by ID
 * @access  Private
 */
router.get("/:id", idParamValidation, taskController.getTaskById);

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update task by ID
 * @access  Private
 */
router.put(
  "/:id",
  idParamValidation,
  taskUpdateValidation,
  taskController.updateTask
);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete task by ID
 * @access  Private
 */
router.delete("/:id", idParamValidation, taskController.deleteTask);

module.exports = router;
