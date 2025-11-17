const express = require("express");
const router = express.Router();
const {
  createAnnouncement,
  getAnnouncements,
  deleteAnnouncement
} = require("../controllers/announcementController");

const { verifyToken, authorizeRole } = require("../middleware/auth");

// Get all announcements
router.get("/", verifyToken, getAnnouncements);

// Create new announcement (tutor/admin only)
router.post("/", verifyToken, authorizeRole(["tutor", "admin"]), createAnnouncement);

// Delete announcement (tutor/admin only)
router.delete("/:id", verifyToken, authorizeRole(["tutor", "admin"]), deleteAnnouncement);

module.exports = router;
