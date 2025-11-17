// backend/createAdmin.js
const mongoose = require('mongoose');
const Admin = require('./models/admin');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const connectDB = require('./config/db');

(async () => {
  try {
    await connectDB(); // Connect to MongoDB
    console.log('✅ Connected to database');

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt); // simple password

    // Create admin
    const admin = new Admin({
      name: 'Super Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      notifications: true,
      active: true
    });

    await admin.save();
    console.log('✅ Admin created successfully');
    process.exit(); // End script
  } catch (err) {
    console.error('❌ Error creating admin:', err);
    process.exit(1);
  }
})();
