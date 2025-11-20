const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // use same secret as middleware

// Show login page
exports.showLoginPage = (req, res) => {
  res.sendFile('filee.html', { root: path.join(__dirname, '../frontend') });
};

// Handle unified login (admin part)
exports.loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find admin by username
    const admin = await Admin.findOne({ name: username }); // assuming admin model has 'name' field
    if (!admin) return res.status(400).json({ message: 'Invalid username or password' });

    if (!admin.active) return res.status(403).json({ message: 'Account inactive. Contact support.' });

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid username or password' });

    // Generate JWT token
    const token = jwt.sign({ id: admin._id, role: 'admin', name: admin.name }, JWT_SECRET, { expiresIn: '1h' });

    // Send JSON response
    res.json({
      message: 'Login successful',
      token,
      role: 'admin',
      username: admin.name
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Show admin dashboard
exports.showDashboard = (req, res) => {
  res.sendFile('admin.html', { root: path.join(__dirname, '../frontend') });
};

// Handle logout
exports.logoutAdmin = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error logging out');
    }
    res.redirect('/login');
  });
};
