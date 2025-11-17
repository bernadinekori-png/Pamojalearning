const Announcement = require("../models/Announcement");
const Notification = require("../models/notification"); // lowercase
const User = require("../models/User"); // use User to find students by role

// Create announcement + generate notifications for students
const createAnnouncement = async (req, res) => {
  try {
    const { title, message, type } = req.body;

    if (!title || !message || !type) {
      return res.status(400).json({ message: "Title, message, and type are required" });
    }

    const newAnnouncement = new Announcement({
      title,
      message,
      type,
      createdBy: req.user._id,
      role: req.user.role,
    });

    await newAnnouncement.save();

    // --- Generate notifications for all students (from Users collection) ---
    const students = await User.find({ role: "student" }, "_id username");
    const notifications = students.map((student) => ({
      studentId: student._id, // reference User _id so student fetch matches
      message: `New ${type} from ${req.user.username}: ${title}`,
      read: false,
    }));

    await Notification.insertMany(notifications);

    res.status(201).json({
      message: "Announcement created and notifications sent",
      announcement: newAnnouncement
    });
  } catch (err) {
    console.error("createAnnouncement error:", err);
    res.status(500).json({ message: "Server error creating announcement" });
  }
};

// Get all announcements
const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate("createdBy", "username email role")
      .sort({ createdAt: -1 });

    // Frontend expects { announcements }
    res.status(200).json({ announcements });
  } catch (err) {
    console.error("getAnnouncements error:", err);
    res.status(500).json({ message: "Server error fetching announcements" });
  }
};

// Delete announcement
const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const announcement = await Announcement.findById(id);

    if (!announcement)
      return res.status(404).json({ message: "Announcement not found" });

    // Only allow creator or admin to delete
    if (announcement.createdBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: cannot delete this announcement" });
    }

    await Announcement.findByIdAndDelete(id);
    res.json({ message: "Announcement deleted successfully" });
  } catch (err) {
    console.error("deleteAnnouncement error:", err);
    res.status(500).json({ message: "Server error deleting announcement" });
  }
};

module.exports = { createAnnouncement, getAnnouncements, deleteAnnouncement };
