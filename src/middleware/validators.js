const { body, param, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  handleValidationErrors,
];

const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

const taskValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 255 })
    .withMessage("Title must be between 3 and 255 characters"),
  body("description").optional().trim(),
  body("scheduled_time")
    .notEmpty()
    .withMessage("Scheduled time is required")
    .custom((value) => {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date format");
      }
      if (date <= new Date()) {
        throw new Error("Scheduled time must be in the future");
      }
      return true;
    }),
  handleValidationErrors,
];

const taskUpdateValidation = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage("Title must be between 3 and 255 characters"),
  body("description").optional().trim(),
  body("status")
    .optional()
    .isIn(["pending", "scheduled", "completed", "failed"])
    .withMessage("Invalid status"),
  handleValidationErrors,
];

const scheduleUpdateValidation = [
  body("scheduled_time")
    .notEmpty()
    .withMessage("Scheduled time is required")
    .custom((value) => {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date format");
      }
      if (date <= new Date()) {
        throw new Error("Scheduled time must be in the future");
      }
      return true;
    }),
  handleValidationErrors,
];

const idParamValidation = [
  param("id").isInt({ min: 1 }).withMessage("Invalid ID"),
  handleValidationErrors,
];

module.exports = {
  registerValidation,
  loginValidation,
  taskValidation,
  taskUpdateValidation,
  scheduleUpdateValidation,
  idParamValidation,
  handleValidationErrors,
};
