const Announcement = require('../models/announce');

// ---------------- GET ALL ANNOUNCEMENTS ----------------
const getAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({ createdAt: -1 });
        res.json(announcements);
    } catch (err) {
        console.error("Error fetching announcements:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// ---------------- ADD NEW ANNOUNCEMENT ----------------
const addAnnouncement = async (req, res) => {
    const { title, message, audience } = req.body;

    if (!title || !message) {
        return res.status(400).json({ message: "Title and message are required" });
    }

    try {
        const announcement = new Announcement({ title, message, audience });
        await announcement.save();
        res.status(201).json(announcement);
    } catch (err) {
        console.error("Error adding announcement:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// ---------------- DELETE ANNOUNCEMENT ----------------
const deleteAnnouncement = async (req, res) => {
    const { id } = req.params;

    try {
        const announcement = await Announcement.findById(id);
        if (!announcement) return res.status(404).json({ message: "Announcement not found" });

        await announcement.deleteOne(); // Works in Mongoose 7
        res.json({ message: "Announcement deleted successfully" });
    } catch (err) {
        console.error("Error deleting announcement:", err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getAnnouncements, addAnnouncement, deleteAnnouncement };
