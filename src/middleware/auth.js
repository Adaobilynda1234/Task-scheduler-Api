const jwt = require("jsonwebtoken");
const { createResponse } = require("../utils/helpers");

const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json(createResponse(false, "Access denied. No token provided."));
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user info to request
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json(createResponse(false, "Invalid token."));
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json(createResponse(false, "Token expired."));
    }
    return res
      .status(500)
      .json(createResponse(false, "Internal server error."));
  }
};

module.exports = authMiddleware;
