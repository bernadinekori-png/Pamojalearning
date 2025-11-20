const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/admin");
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Verify token middleware for general users
exports.verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers["x-access-token"];
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    let user;

    if (decoded.role === "admin") {
      user = await Admin.findById(decoded.id);
    } else {
      user = await User.findById(decoded.id);
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user; // attach user document
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Role-based authorization middleware
exports.authorizeRole = (allowedRoles = []) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });

  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden: you don’t have access to this page" });
  }

  next();
};

// Admin JWT authentication middleware
exports.adminAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers["x-access-token"];
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: admin access only" });
    }

    const admin = await Admin.findById(decoded.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    req.user = admin;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
