const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",       // or "User" depending on your auth model
    required: true
  },

  studentName: { type: String, required: true }, // uploader’s name

  fileName: { type: String, required: true },
  fileType: { type: String },
  filePath: { type: String },

  isFolder: { type: Boolean, default: false },
  uploadedAt: { type: Date, default: Date.now },

  status: { type: String, enum: ["pending", "reviewed"], default: "pending" },
  feedback: { type: String, default: "" },
});

module.exports = mongoose.model("ProjectFile", fileSchema);
