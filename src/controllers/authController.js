const jwt = require("jsonwebtoken");
const User = require("../models/User");
const EmailService = require("../services/emailService");
const { sanitizeUser, createResponse } = require("../utils/helpers");
const logger = require("../utils/logger");

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res
        .status(409)
        .json(createResponse(false, "User with this email already exists"));
    }

    // Create new user
    const userId = await User.create({ name, email, password });
    const user = await User.findById(userId);

    // Generate JWT token
    const token = generateToken(user);

    // Send welcome email (don't wait for it)
    EmailService.sendWelcomeEmail(email, {
      userName: name,
      userEmail: email,
    }).catch((err) => logger.error("Failed to send welcome email:", err));

    logger.info(`New user registered: ${email}`);

    res.status(201).json(
      createResponse(true, "User registered successfully", {
        token,
        user: sanitizeUser(user),
      })
    );
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res
        .status(401)
        .json(createResponse(false, "Invalid email or password"));
    }

    // Verify password
    const isPasswordValid = await User.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json(createResponse(false, "Invalid email or password"));
    }

    // Generate JWT token
    const token = generateToken(user);

    logger.info(`User logged in: ${email}`);

    res.json(
      createResponse(true, "Login successful", {
        token,
        user: sanitizeUser(user),
      })
    );
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json(createResponse(false, "User not found"));
    }

    res.json(
      createResponse(true, "Profile retrieved successfully", {
        user: sanitizeUser(user),
      })
    );
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, password } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (password) updateData.password = password;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json(createResponse(false, "No fields to update"));
    }

    const updated = await User.updateById(req.user.id, updateData);

    if (!updated) {
      return res.status(404).json(createResponse(false, "User not found"));
    }

    const user = await User.findById(req.user.id);

    logger.info(`User profile updated: ${req.user.email}`);

    res.json(
      createResponse(true, "Profile updated successfully", {
        user: sanitizeUser(user),
      })
    );
  } catch (error) {
    next(error);
  }
};
