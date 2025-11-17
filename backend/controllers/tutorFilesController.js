const ProjectFile = require("../models/myproject");

// Get all student files (for tutor dashboard)
exports.getTutorProjects = async (req, res) => {
  try {
    const files = await ProjectFile.find().sort({ uploadedAt: -1 });

    res.status(200).json(files);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ message: "Server error while fetching files" });
  }
};

// Mark a file as reviewed
exports.markFileReviewed = async (req, res) => {
  try {
    const { fileId } = req.params;
    const { feedback } = req.body;

    const file = await ProjectFile.findById(fileId);
    if (!file) return res.status(404).json({ message: "File not found" });

    file.status = "reviewed";
    if (feedback) file.feedback = feedback;

    await file.save();

    res.status(200).json({ message: "File marked as reviewed", file });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while reviewing file" });
  }
};
