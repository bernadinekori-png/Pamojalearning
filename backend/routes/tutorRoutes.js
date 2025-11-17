const express = require("express");
const router = express.Router();
const { verifyToken, authorizeRole } = require("../middleware/auth");
const { updatePhoto, updateProfile, changePassword } = require("../controllers/tutorController");
const upload = require("../middleware/upload");

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
