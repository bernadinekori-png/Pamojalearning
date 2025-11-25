// backend/server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
require("dotenv").config();
const path = require("path");

// Load backup scheduler (runs cron jobs for file backups)
require("./backup");

// Database connection
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const myprojectRoutes = require("./routes/myprojectRoutes");
const profileRoutes = require("./routes/profileRoutes");
const tutorRoutes = require("./routes/tutorRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const tutorFilesRoutes = require("./routes/tutorFilesRoutes");
const notificationRoutes = require('./routes/notificationRoutes');
const adminDashboardRoutes = require("./routes/adminDashboardRoutes");
const manageRoutes = require('./routes/managetRoutes');
const manageStudentRoutes = require('./routes/managestRoutes');
const announceRoutes = require('./routes/announceRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const adminLoginRoutes = require('./routes/loginRoutes');

console.log("Auth routes loaded");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// --- ✅ Session middleware for admin login (MongoDB-backed) ---
app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecretkey',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI, // ✅ Fixed: Changed from MONGO_URI to MONGODB_URI
    collectionName: "sessions",
    touchAfter: 24 * 3600 // Lazy session update (24 hours)
  }),
  cookie: { 
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    httpOnly: true, // Prevents XSS attacks
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'strict' // CSRF protection
  }
}));

// Serve uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../frontend")));

// ✅ Connect to MongoDB
(async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connection established successfully");
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1);
  }
})();

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/files", myprojectRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/tutor", tutorRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/tutor/files", tutorFilesRoutes);
app.use('/api/student/notifications', notificationRoutes);
app.use("/api/admin", adminDashboardRoutes);
app.use('/api/managet', manageRoutes);
app.use('/api/managest', manageStudentRoutes);
app.use('/api/announcements', announceRoutes);
app.use('/api/admin', settingsRoutes);
app.use('/admin', adminLoginRoutes);

// ✅ Test Routes
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working" });
});

// ✅ Serve Frontend - This should be LAST, after all API routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend", "filee.html"));
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});