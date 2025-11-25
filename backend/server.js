// backend/server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session"); // ✅ Added for admin login sessions
require("dotenv").config();
const path = require("path");

// Load backup scheduler (runs cron jobs for file backups)
require("./backup");

// Database connection
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes"); // ✅ includes tutor & student dashboards
const uploadRoutes = require("./routes/uploadRoutes");
const myprojectRoutes = require("./routes/myprojectRoutes");
const profileRoutes = require("./routes/profileRoutes");
const tutorRoutes = require("./routes/tutorRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const tutorFilesRoutes = require("./routes/tutorFilesRoutes");
const notificationRoutes = require('./routes/notificationRoutes');
const adminDashboardRoutes = require("./routes/adminDashboardRoutes");
const manageRoutes = require('./routes/managetRoutes');
const manageStudentRoutes = require('./routes/managestRoutes'); // Students routes
const announceRoutes = require('./routes/announceRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const adminLoginRoutes = require('./routes/loginRoutes'); // This is the admin login route

console.log("Auth routes loaded");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); // support HTML form posts


// --- ✅ Session middleware for admin login ---
app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecretkey',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 } // 1 hour
}));


// Serve frontend and uploads
app.use(express.static(path.join(__dirname, "../frontend")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Connect to MongoDB
(async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connection established successfully");
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1); // Stop server if DB fails
  }
})();

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes); // ✅ Handles tutor-dashboard stats
app.use("/api/upload", uploadRoutes);
app.use("/api/files", myprojectRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/tutor", tutorRoutes); // ✅ Tutor profile/update routes
app.use("/api/announcements", announcementRoutes);
app.use("/api/tutor/files", tutorFilesRoutes);
app.use('/api/student/notifications', notificationRoutes);
app.use("/api/admin", adminDashboardRoutes);
app.use('/api/managet', manageRoutes);  // Manage Tutors endpoints
app.use('/api/managest', manageStudentRoutes);  // Students endpoints
app.use('/api/announcements', announceRoutes); // <- Announcement routes
app.use('/api/admin', settingsRoutes);
app.use('/admin', adminLoginRoutes);


// ✅ Test Routes
app.get("/", (req, res) => {
  res.send("Backend server is running successfully");
});

app.get("/test", (req, res) => {
  res.send("Test route working");
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
