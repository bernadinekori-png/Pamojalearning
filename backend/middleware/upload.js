// middleware/upload.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ensure uploads/tutors directory exists
const uploadDir = path.join(__dirname, "..", "uploads", "tutors");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // use tutorId-timestamp.ext so it's unique
    const ext = path.extname(file.originalname);
    const tutorId = req.user ? req.user.id : "anon";
    const filename = `${tutorId}-${Date.now()}${ext}`;
    cb(null, filename);
  }
});

// file filter: only images
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeOk = allowed.test(file.mimetype);
  const extOk = allowed.test(ext);
  if (mimeOk && extOk) cb(null, true);
  else cb(new Error("Only JPEG/PNG images are allowed"));
};

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter
});

module.exports = upload;
