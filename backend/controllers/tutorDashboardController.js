const Student = require("../models/Student");
const File = require("../models/File");
const Announcement = require("../models/Announcement");

const getTutorDashboard = async (req, res) => {
  try {
    const tutorId = req.user.id; // retrieved from token after authentication

    const studentsSupervised = await Student.countDocuments({ tutorId });
    const filesPendingReview = await File.countDocuments({ tutorId, status: "pending" });
    const announcementsPosted = await Announcement.countDocuments({ tutorId });

    res.status(200).json({
      studentsSupervised,
      filesPendingReview,
      announcementsPosted,
    });
  } catch (err) {
    console.error("Error fetching tutor dashboard:", err);
    res.status(500).json({ message: "Server error fetching tutor dashboard" });
  }
};

module.exports = { getTutorDashboard };
