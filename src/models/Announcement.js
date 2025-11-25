const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { 
      type: String, 
      enum: ["today", "urgent", "deadline", "maintenance"], 
      required: true 
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, enum: ["tutor", "admin"], required: true },
  },
  { timestamps: true } // automatically adds createdAt and updatedAt
);

module.exports =
  mongoose.models.Announcement ||
  mongoose.model("Announcement", announcementSchema);
