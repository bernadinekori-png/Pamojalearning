const bcrypt = require("bcryptjs");
const User = require("../models/User");

// ------------------------
// Update profile photo
// ------------------------
const updatePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const photoPath = `/uploads/tutors/${req.file.filename}`;

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { photo: photoPath },
      { new: true, select: "-password" }
    );

    if (!updated) return res.status(404).json({ message: "User not found" });

    res.json({
      message: "Photo updated",
      photoUrl: photoPath,
      profile: updated,
    });
  } catch (err) {
    console.error("updatePhoto error:", err);
    res.status(500).json({ message: "Server error updating photo" });
  }
};

// ------------------------
// Update profile info (username, email, department)
// ------------------------
const updateProfile = async (req, res) => {
  try {
    const { name, email, department } = req.body;

    const updateFields = {};
    if (name) updateFields.username = name;
    if (email) updateFields.email = email;
    if (department) updateFields.department = department;

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      updateFields,
      { new: true, select: "-password" }
    );

    if (!updated) return res.status(404).json({ message: "User not found" });

    res.json({
      message: "Profile updated successfully",
      profile: updated,
    });
  } catch (err) {
    console.error("updateProfile error:", err);
    res.status(500).json({ message: "Server error updating profile" });
  }
};

// ------------------------
// Change password
// ------------------------
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("changePassword error:", err);
    res.status(500).json({ message: "Server error updating password" });
  }
};

module.exports = { updatePhoto, updateProfile, changePassword };
