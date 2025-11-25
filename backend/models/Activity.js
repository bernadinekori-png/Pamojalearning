const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    role: { type: String, enum: ["tutor", "student", "admin"], required: true },
    activity: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Activity || mongoose.model("Activity", activitySchema);
