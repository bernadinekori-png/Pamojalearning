const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  fileType: { type: String },
  filePath: { type: String },
  studentName: { type: String, required: true }, // ✅ store uploader’s name
  isFolder: { type: Boolean, default: false },
  uploadedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["pending", "reviewed"], default: "pending" },
  feedback: { type: String, default: "" },
});

module.exports = mongoose.model("ProjectFile", fileSchema);

