const express = require('express');
const router = express.Router();
const {
  updateProfile,
  changePassword,
  toggleNotifications,
  deactivateAccount
} = require('../controllers/settingsController');

const { verifyToken } = require('../middleware/auth'); // Only JWT for students/tutors

// All routes require authentication
router.use(verifyToken); // ✅ pass the function, not the object

// -------- Update Profile --------
router.patch('/profile', updateProfile);

// -------- Change Password --------
router.patch('/change-password', changePassword);

// -------- Toggle Notifications --------
router.patch('/notifications', toggleNotifications);

// -------- Deactivate Account --------
router.patch('/deactivate', deactivateAccount);

module.exports = router;
