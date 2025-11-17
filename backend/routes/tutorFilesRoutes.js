const express = require("express");
const router = express.Router();
const { verifyToken, authorizeRole } = require("../middleware/auth");
const { getTutorProjects, markFileReviewed } = require("../controllers/tutorFilesController");

// Get all student files (tutor dashboard)
router.get("/", verifyToken, authorizeRole(["tutor"]), getTutorProjects);

// Mark a student file as reviewed with optional feedback
router.put("/:fileId/review", verifyToken, authorizeRole(["tutor"]), markFileReviewed);

module.exports = router;
