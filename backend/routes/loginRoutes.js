const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController'); // make sure this exists
const { adminAuth } = require('../middleware/auth');

// Admin login page (GET) -> serves the unified login page (filee.html)
router.get('/login', adminController.showLoginPage);

// Admin login form submission (POST) -> handles admin login
router.post('/login', adminController.loginAdmin);

// Admin dashboard (protected)
router.get('/dashboard', adminAuth, adminController.showDashboard);

// Admin logout
router.get('/logout', adminController.logoutAdmin);

module.exports = router;
