// backend/routes/adminDashboardRoutes.js
const express = require("express");
const router = express.Router();

// Import models
const Tutor = require("../models/Tutor");
//const Student = require("../models/Student");
const Announcement = require("../models/Announcement");
const ProjectFile = require("../models/myproject");
const Notification = require("../models/notification");

// ----------------------------
// GET /api/admin/kpis
// Returns total counts for dashboard cards
// ----------------------------
router.get("/kpis", async (req, res) => {
  try {
    const [totalTutors, totalStudents, totalAnnouncements, pendingRequests] =
      await Promise.all([
        Tutor.countDocuments(),
        ManageStudent.countDocuments(),
        Announcement.countDocuments(),
        ProjectFile.countDocuments({ status: "pending" }),
      ]);

    res.json({
      totalTutors,
      totalStudents,
      totalAnnouncements,
      pendingRequests,
    });
  } catch (err) {
    console.error("Error in /api/admin/kpis", err);
    res.status(500).json({ message: "Failed to load KPIs" });
  }
});

// ----------------------------
// GET /api/admin/charts
// Returns data for dashboard charts
// ----------------------------
router.get("/charts", async (req, res) => {
  try {
    // Students per tutor
    const studentsAgg = await Student.aggregate([
      {
        $group: {
          _id: "$tutorId",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "tutors",
          localField: "_id",
          foreignField: "_id",
          as: "tutor",
        },
      },
      { $unwind: "$tutor" },
      {
        $project: {
          _id: 0,
          name: "$tutor.name",
          count: 1,
        },
      },
    ]);

    const studentsPerTutor = {
      labels: studentsAgg.map((t) => t.name),
      values: studentsAgg.map((t) => t.count),
    };

    // Announcements over the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const annAgg = await Announcement.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const labels = annAgg.map(
      (a) => `${a._id.year}-${String(a._id.month).padStart(2, "0")}`
    );
    const values = annAgg.map((a) => a.count);

    res.json({
      studentsPerTutor,
      announcementsOverTime: { labels, values },
    });
  } catch (err) {
    console.error("Error in /api/admin/charts", err);
    res.status(500).json({ message: "Failed to load charts" });
  }
});

// ----------------------------
// GET /api/admin/recent-activities
// Last uploads & announcements
// ----------------------------
router.get("/recent-activities", async (req, res) => {
  try {
    const [latestAnnouncements, latestFiles] = await Promise.all([
      Announcement.find().sort({ createdAt: -1 }).limit(5),
      ProjectFile.find().sort({ uploadedAt: -1 }).limit(5),
    ]);

    const activities = [
      ...latestAnnouncements.map((a) => ({
        activity: `Announcement: ${a.title}`,
        user: a.role === "admin" ? "Admin" : "Tutor",
        date: a.createdAt,
      })),
      ...latestFiles.map((f) => ({
        activity: `Uploaded assignment: ${f.fileName}`,
        user: f.studentName,
        date: f.uploadedAt,
      })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    res.json(activities);
  } catch (err) {
    console.error("Error in /api/admin/recent-activities", err);
    res.status(500).json({ message: "Failed to load activities" });
  }
});

// ----------------------------
// GET /api/admin/notifications
// List notifications
// ----------------------------
router.get("/notifications", async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(notifications);
  } catch (err) {
    console.error("Error in /api/admin/notifications", err);
    res.status(500).json({ message: "Failed to load notifications" });
  }
});

// ----------------------------
// PATCH /api/admin/notifications/:id/read
// Mark a notification as read
// ----------------------------
router.patch("/notifications/:id/read", async (req, res) => {
  try {
    const { id } = req.params;
    const notif = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );
    if (!notif) return res.status(404).json({ message: "Notification not found" });
    res.json({ success: true, notification: notif });
  } catch (err) {
    console.error("Error in /api/admin/notifications/:id/read", err);
    res.status(500).json({ message: "Failed to update notification" });
  }
});

module.exports = router;
