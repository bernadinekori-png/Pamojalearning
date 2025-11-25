const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  commenter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  attachments: [{ type: String }],
  status: { type: String, enum: ['pending','approved','rejected','in-review'], default: 'pending' },
  submitter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  department: { type: String },
  comments: [commentSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

module.exports = mongoose.model('Report', reportSchema);
