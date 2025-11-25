const express = require('express');
const router = express.Router();
const { getStudents, addStudent, deleteStudent } = require('../controllers/managestController');

// @route   GET /api/managest
// @desc    Get all students
router.get('/', getStudents);

// @route   POST /api/managest
// @desc    Add a new student
router.post('/', addStudent);

// @route   DELETE /api/managest/:id
// @desc    Delete a student by ID
router.delete('/:id', deleteStudent);

module.exports = router;
