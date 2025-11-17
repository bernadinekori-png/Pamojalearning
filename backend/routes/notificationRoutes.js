const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { getNotifications, markAsRead } = require('../controllers/notificationController');

// Get all notifications for the logged-in student
router.get('/', verifyToken, getNotifications);

// Mark a notification as read
router.patch('/:id/read', verifyToken, markAsRead);

module.exports = router; // fixed typo
