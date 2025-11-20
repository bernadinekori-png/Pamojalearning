const mongoose = require('mongoose');
require('dotenv').config();
const Admin = require('./models/admin'); // adjust path if needed
const connectDB = require('./config/db');

async function initAdmin() {
  try {
    // Connect using the same config as the main app
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ name: 'cyyynthia' });
    if (existingAdmin) {
      console.log('Admin already exists!');
      return mongoose.disconnect();
    }

    // Create new admin (password will be hashed by the Admin model pre-save hook)
    const admin = new Admin({
      name: 'cyyynthia',         // username for login
      email: 'cynthia@gmail.com', // email
      password: '370000',        // plain password; model will hash it
      notifications: true,
      active: true
    });

    await admin.save();
    console.log('Admin created successfully!');
    mongoose.disconnect();
  } catch (err) {
    console.error('Error creating admin:', err);
    mongoose.disconnect();
  }
}

// Run the init function
initAdmin();
