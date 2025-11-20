const ProjectFile = require("../models/myproject");
const fs = require("fs");
const path = require("path");

// -------------------- UPLOAD FILES --------------------
exports.uploadFiles = async (req, res) => {
  try {
    const folderName = req.body.folderName || null;

    // Common way to resolve student name
    const resolvedStudentName =
      (req.user && req.user.name) ||
      req.body.studentName ||
      "Unknown Student";

    if (folderName) {
      const folder = new ProjectFile({
        fileName: folderName,
        fileType: "folder",
        filePath: `uploads/${folderName}`,
        isFolder: true,
        studentName: resolvedStudentName,
      });
      await folder.save();
      return res.json({ message: "Folder uploaded successfully", file: folder });
    }

    const savedFiles = [];
    for (const file of req.files) {
      const filePath = folderName
        ? `uploads/${folderName}/${file.filename}`
        : `uploads/${file.filename}`;

      const newFile = new ProjectFile({
        fileName: file.originalname,
        fileType: file.mimetype,
        filePath,
        isFolder: false,
        studentName: resolvedStudentName,
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
    const files = await ProjectFile.find().sort({ uploadedAt: -1 });
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
    const files = await ProjectFile.find({
      fileName: { $regex: q, $options: "i" },
    });
    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Search failed" });
  }
};