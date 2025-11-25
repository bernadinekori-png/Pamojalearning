const express = require('express');
const router = express.Router();
const { getTutors, addTutor, deleteTutor } = require('../controllers/managetController');

// @route   GET /api/managet
// @desc    Get all tutors
router.get('/', getTutors);

// @route   POST /api/managet
// @desc    Add a new tutor
router.post('/', addTutor);

// @route   DELETE /api/managet/:id
// @desc    Delete a tutor by ID
router.delete('/:id', deleteTutor);

module.exports = router;
