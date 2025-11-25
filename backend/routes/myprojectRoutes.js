const express = require("express");
const multer = require("multer");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const { uploadFiles, getAllFiles, deleteFile, searchFiles, shareFileToTutor } = require("../controllers/studentFilesController");
const { verifyToken, authorizeRole } = require("../middleware/auth");

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folderName = req.body.folderName || "";

    // Ensure we have an authenticated user with a username
    const username = req.user && req.user.username ? req.user.username : "unknown";

    // Base path: uploads/<username>/
    const basePath = path.join("uploads", username);

    // If a folderName is provided, nest inside it: uploads/<username>/<folderName>/
    const uploadPath = folderName ? path.join(basePath, folderName) : basePath;

    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Routes (student must be authenticated)
router.post("/", verifyToken, authorizeRole(["student"]), upload.array("files"), uploadFiles);
router.get("/", verifyToken, authorizeRole(["student"]), getAllFiles);
router.get("/search", verifyToken, authorizeRole(["student"]), searchFiles);
router.delete("/:id", verifyToken, authorizeRole(["student"]), deleteFile);
router.post("/:id/share", verifyToken, authorizeRole(["student"]), shareFileToTutor);

module.exports = router;
