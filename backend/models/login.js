// /routes/loginRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Show login page
router.get('/login', authController.showLoginPage);

// Handle login form submission
router.post('/login', authController.loginAdmin);

// Handle logout
router.get('/logout', authController.logoutAdmin);

module.exports = router;