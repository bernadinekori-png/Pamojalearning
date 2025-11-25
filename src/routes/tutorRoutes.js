const express = require("express");
const router = express.Router();
const { verifyToken, authorizeRole } = require("../middleware/auth");
const { updatePhoto, updateProfile, changePassword } = require("../controllers/tutorController");
const upload = require("../middleware/upload");
const User = require("../models/User");

// List tutors (for students to choose when sharing projects)
router.get("/list", verifyToken, async (req, res) => {
  try {
    const tutors = await User.find({ role: "tutor" }).select("_id username email department");
    res.json(tutors);
  } catch (err) {
    console.error("/api/tutor/list error", err);
    res.status(500).json({ message: "Failed to load tutors" });
  }
});

// GET tutor dashboard
router.get("/", verifyToken, authorizeRole(["tutor"]), async (req, res) => {
  res.json({
    message: `Welcome, ${req.user.username}`,
    data: req.user,
  });
});

// POST profile photo
router.post(
  "/profile/photo",
  verifyToken,
  authorizeRole(["tutor"]),
  upload.single("photo"),
  updatePhoto
);

// PUT profile info (name, email, department)
router.put(
  "/profile",
  verifyToken,
  authorizeRole(["tutor"]),
  updateProfile
);

// PUT change password
router.put(
  "/profile/password",
  verifyToken,
  authorizeRole(["tutor"]),
  changePassword
);

module.exports = router;
