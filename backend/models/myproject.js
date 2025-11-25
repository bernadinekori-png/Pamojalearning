const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",       // link to authenticated user
    required: true
  },

  studentName: { type: String, required: true }, // uploader’s name

  // Optional tutor this project is shared with
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },

  fileName: { type: String, required: true },
  fileType: { type: String },
  filePath: { type: String },

  isFolder: { type: Boolean, default: false },
  uploadedAt: { type: Date, default: Date.now },

  status: { type: String, enum: ["pending", "reviewed"], default: "pending" },
  feedback: { type: String, default: "" },
});

module.exports = mongoose.model("ProjectFile", fileSchema);
