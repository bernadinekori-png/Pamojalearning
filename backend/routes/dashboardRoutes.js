// backend/routes/dashboardRoutes.js
const express = require("express");
const router = express.Router();
const { verifyToken, authorizeRole } = require("../middleware/auth");
const User = require("../models/User");
const { getTutorDashboard } = require("../controllers/tutorDashboardController"); // ✅ Import the stats controller

// 🧑‍🎓 Student Dashboard
router.get("/student", verifyToken, authorizeRole(["student"]), async (req, res) => {
  try {
    const student = await User.findById(req.user.id).select("-password");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({
      user: student,
      welcome: `Welcome to your dashboard, ${student.username}!`,
      info: "This is your student dashboard page.",
    });
  } catch (err) {
    console.error("Error loading student dashboard:", err);
    res.status(500).json({ message: "Server error loading student dashboard" });
  }
});

// 🧑‍🏫 Tutor Dashboard (basic info)
router.get("/tutor", verifyToken, authorizeRole(["tutor"]), async (req, res) => {
  try {
    const tutor = await User.findById(req.user.id).select("-password");
    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    res.json({
      user: tutor,
      welcome: `Welcome to your dashboard, ${tutor.username}!`,
      info: "This is your tutor dashboard page.",
    });
  } catch (err) {
    console.error("Error loading tutor dashboard:", err);
    res.status(500).json({ message: "Server error loading tutor dashboard" });
  }
});

// 📊 Tutor Statistics Dashboard (for dashboard cards)
router.get(
  "/tutor-dashboard",
  verifyToken,
  authorizeRole(["tutor"]),
  getTutorDashboard // ✅ Controller function from tutorDashboardController.js
);

module.exports = router;
