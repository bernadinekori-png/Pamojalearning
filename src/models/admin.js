const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // username for login
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  notifications: { type: Boolean, default: true },
  active: { type: Boolean, default: true }
}, { timestamps: true }); // adds createdAt and updatedAt automatically

// Pre-save hook to hash password if modified
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare password during login
adminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.models.Admin || mongoose.model('Admin', adminSchema);
