// backend/middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

exports.verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers["x-access-token"];
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user; // attach user document
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

exports.authorizeRole = (allowedRoles = []) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });

  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden: you don’t have access to this page" });
  }

  next();
};

// Session-based authentication for admin
exports.adminAuth = (req, res, next) => {
  if (!req.session || !req.session.adminId) {
    return res.redirect("/admin/login"); // redirect to admin login page
  }
  next();
};
