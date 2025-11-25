const Admin = require('../models/admin'); // ensure path is correct
const Settings = require('../models/settings');
const bcrypt = require('bcryptjs');

// ===================== SETTINGS CONTROLLER =====================

// -------- Update Admin Profile --------
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const adminId = req.user._id; // from auth middleware

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      adminId,
      { name, email },
      { new: true, runValidators: true }
    );

    res.json({ message: 'Profile updated successfully', admin: updatedAdmin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// -------- Change Password --------
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminId = req.user._id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both passwords are required' });
    }

    const admin = await Admin.findById(adminId);

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// -------- Toggle Notifications --------
exports.toggleNotifications = async (req, res) => {
  try {
    const adminId = req.user._id;
    const { enabled } = req.body;

    let settings = await Settings.findOne({ admin: adminId });
    if (!settings) {
      settings = new Settings({ admin: adminId, notificationsEnabled: enabled });
    } else {
      settings.notificationsEnabled = enabled;
    }
    await settings.save();

    res.json({ message: `Notifications ${enabled ? 'enabled' : 'disabled'}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// -------- Deactivate Account --------
exports.deactivateAccount = async (req, res) => {
  try {
    const adminId = req.user._id;

    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    admin.active = false;
    await admin.save();

    res.json({ message: 'Account deactivated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
