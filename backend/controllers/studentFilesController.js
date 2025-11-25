const ProjectFile = require("../models/myproject");
const fs = require("fs");
const path = require("path");

// -------------------- UPLOAD FILES --------------------
exports.uploadFiles = async (req, res) => {
  try {
    const folderName = req.body.folderName || null;

    // Use authenticated user as the owner of the files
    const studentId = req.user && req.user.id;
    const resolvedStudentName =
      (req.user && (req.user.username || req.user.name)) ||
      req.body.studentName ||
      "Unknown Student";

    // We'll also use the username to build the disk path: uploads/<username>/...
    const username = req.user && req.user.username ? req.user.username : "unknown";

    if (!studentId) {
      return res.status(401).json({ message: "Unauthorized: missing student id" });
    }

    if (folderName) {
      const folder = new ProjectFile({
        studentId,
        studentName: resolvedStudentName,
        fileName: folderName,
        fileType: "folder",
        filePath: `uploads/${username}/${folderName}`,
        isFolder: true,
      });

      await folder.save();
      return res.json({ message: "Folder uploaded successfully", file: folder });
    }

    const savedFiles = [];
    for (const file of req.files) {
      const filePath = folderName
        ? `uploads/${username}/${folderName}/${file.filename}`
        : `uploads/${username}/${file.filename}`;

      const newFile = new ProjectFile({
        studentId,
        studentName: resolvedStudentName,
        fileName: file.originalname,
        fileType: file.mimetype,
        filePath,
        isFolder: false,
      });

      await newFile.save();
      savedFiles.push(newFile);
    }

    res.json({ message: "Files uploaded successfully", files: savedFiles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
};

// -------------------- GET ALL FILES --------------------
exports.getAllFiles = async (req, res) => {
  try {
    const studentId = req.user && req.user.id;

    const files = await ProjectFile.find({ studentId }).sort({ uploadedAt: -1 });

    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while fetching files" });
  }
};

// -------------------- DELETE FILE --------------------
exports.deleteFile = async (req, res) => {
  try {
    const file = await ProjectFile.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    const filePath = path.join(__dirname, "..", file.filePath);

    if (file.isFolder && fs.existsSync(filePath)) {
      fs.rmSync(filePath, { recursive: true, force: true });
    } else if (!file.isFolder && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await file.deleteOne();
    res.json({ message: `${file.isFolder ? "Folder" : "File"} deleted successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while deleting file" });
  }
};

// -------------------- SEARCH FILES --------------------
exports.searchFiles = async (req, res) => {
  try {
    const { q } = req.query;
    const studentId = req.user && req.user.id;

    const files = await ProjectFile.find({
      studentId,
      fileName: { $regex: q, $options: "i" },
    });

    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Search failed" });
  }
};

// -------------------- SHARE FILE TO TUTOR --------------------
exports.shareFileToTutor = async (req, res) => {
  try {
    const studentId = req.user && req.user.id;
    const { tutorId } = req.body;
    const { id } = req.params;

    if (!studentId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!tutorId) {
      return res.status(400).json({ message: "Tutor ID is required" });
    }

    const file = await ProjectFile.findById(id);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (String(file.studentId) !== String(studentId)) {
      return res.status(403).json({ message: "You can only share your own files" });
    }

    file.tutorId = tutorId;
    file.status = "pending";
    await file.save();

    res.json({ message: "File shared with tutor", file });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to share file" });
  }
};