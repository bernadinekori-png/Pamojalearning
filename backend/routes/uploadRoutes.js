const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

// Storage setup — files will go to /uploads folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// POST /api/upload
router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.json({
    message: " File uploaded successfully!",
    fileName: req.file.filename
  });
});

module.exports = router;
