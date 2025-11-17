const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin', // assumes you have an Admin model
    required: true,
    unique: true
  },
  notificationsEnabled: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
