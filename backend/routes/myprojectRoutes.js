const express = require("express");
const multer = require("multer");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const { uploadFiles, getAllFiles, deleteFile, searchFiles } = require("../controllers/studentFilesController");

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folderName = req.body.folderName || "";
    const uploadPath = folderName ? path.join("uploads", folderName) : "uploads";
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Routes
router.post("/", upload.array("files"), uploadFiles);
router.get("/", getAllFiles);
router.get("/search", searchFiles);
router.delete("/:id", deleteFile);

module.exports = router;
