const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const path = require('path');

// Show login page
exports.showLoginPage = (req, res) => {
  // Serve login page from frontend folder
  res.sendFile('login.html', { root: path.join(__dirname, '../frontend') });
};

// Handle login form submission
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).send('Invalid email or password');

    if (!admin.active) return res.status(403).send('Account inactive. Contact support.');

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).send('Invalid email or password');

    // Set session
    req.session.adminId = admin._id;
    req.session.adminName = admin.name;

    // Redirect to admin dashboard
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Show dashboard
exports.showDashboard = (req, res) => {
  if (!req.session.adminId) return res.redirect('/admin/login');
  // Serve admin dashboard page from frontend folder
  res.sendFile('admin.html', { root: path.join(__dirname, '../frontend') });
};

// Handle logout
exports.logoutAdmin = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error logging out');
    }
    res.redirect('/admin/login');
  });
};
