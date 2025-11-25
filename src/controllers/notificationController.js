const Notification = require("../models/notification");

// Get notifications for logged-in student
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ studentId: req.user._id })
      .sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching notifications" });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: "Notification not found" });

    notification.read = true;
    await notification.save();
    res.status(200).json({ message: "Notification marked as read" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error marking notification" });
  }
};
