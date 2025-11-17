const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  filename: { type: String, required: true },
  filepath: { type: String, required: true },
  status: { type: String, enum: ["pending", "reviewed"], default: "pending" },
  feedback: { type: String, default: "" },
  uploadedAt: { type: Date, default: Date.now }
});

// Avoid model overwrite
module.exports = mongoose.models.File || mongoose.model("File", fileSchema);
