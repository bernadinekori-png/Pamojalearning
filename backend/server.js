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
const mongoUrl = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!mongoUrl) {
  console.error("❌ ERROR: MONGODB_URI environment variable is not set!");
  process.exit(1);
}

console.log("✅ MongoDB URL found for session store");

app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecretkey',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: mongoUrl,
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

// ✅ Serve frontend static files AFTER API routes
app.use(express.static(path.join(__dirname, "../frontend")));

// ✅ Root route - redirect to your login page
app.get("/", (req, res) => {
  // Check if index.html exists, otherwise serve login.html
  const indexPath = path.join(__dirname, "../frontend", "filee.html");
  const loginPath = path.join(__dirname, "../frontend", "login.html");
  
  const fs = require('fs');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else if (fs.existsSync(loginPath)) {
    res.sendFile(loginPath);
  } else {
    res.status(404).send("Frontend files not found. Please check your deployment.");
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});