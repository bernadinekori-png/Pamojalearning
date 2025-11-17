const express = require('express');
const router = express.Router();
const { getAnnouncements, addAnnouncement, deleteAnnouncement } = require('../controllers/announceController');

// @route   GET /api/announcements
// @desc    Get all announcements
router.get('/', getAnnouncements);

// @route   POST /api/announcements
// @desc    Add a new announcement
router.post('/', addAnnouncement);

// @route   DELETE /api/announcements/:id
// @desc    Delete an announcement by ID
router.delete('/:id', deleteAnnouncement);

module.exports = router;
