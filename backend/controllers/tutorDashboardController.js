const Announcement = require("../models/Announcement");
const ProjectFile = require("../models/myproject");

const getTutorDashboard = async (req, res) => {
  try {
    const tutorId = req.user.id; // retrieved from token after authentication

    // Count distinct students who have shared at least one project with this tutor
    const distinctStudentIds = await ProjectFile.distinct("studentId", { tutorId });
    const studentsSupervised = distinctStudentIds.length;

    // Count this tutor's shared projects that are still pending review
    const filesPendingReview = await ProjectFile.countDocuments({ tutorId, status: "pending" });

    // Count announcements created by this tutor
    const announcementsPosted = await Announcement.countDocuments({
      createdBy: tutorId,
      role: "tutor",
    });

    // Build recent activities for this tutor (recent reviewed files and announcements)
    const recentReviewedFiles = await ProjectFile.find({
      tutorId,
      status: "reviewed",
    })
      .sort({ uploadedAt: -1 })
      .limit(5)
      .select("studentName fileName status uploadedAt");

    const recentAnnouncements = await Announcement.find({
      createdBy: tutorId,
      role: "tutor",
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title type createdAt");

    const activities = [
      ...recentReviewedFiles.map((file) => ({
        kind: "review",
        description: `Reviewed project ${file.fileName} for ${file.studentName}`,
        date: file.uploadedAt,
      })),
      ...recentAnnouncements.map((ann) => ({
        kind: "announcement",
        description: `Posted ${ann.type} announcement: ${ann.title}`,
        date: ann.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    res.status(200).json({
      studentsSupervised,
      filesPendingReview,
      announcementsPosted,
      recentActivities: activities,
    });
  } catch (err) {
    console.error("Error fetching tutor dashboard:", err);
    res.status(500).json({ message: "Server error fetching tutor dashboard" });
  }
};

module.exports = { getTutorDashboard };
