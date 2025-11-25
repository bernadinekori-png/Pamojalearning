const ManageTutor = require('../models/managet');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// ---------------- GET ALL TUTORS ----------------
const getTutors = async (req, res) => {
    try {
        const tutors = await ManageTutor.find().sort({ createdAt: -1 });
        res.json(tutors);
    } catch (err) {
        console.error("Error fetching tutors:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// ---------------- ADD NEW TUTOR ----------------
const addTutor = async (req, res) => {
    const { name, email, phone, subject, password } = req.body;

    if (!name || !email || !phone || !subject || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Check if email already exists in ManageTutor
        const existing = await ManageTutor.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Also ensure username is unique in User collection (use name as username)
        const existingUser = await User.findOne({ username: name });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Create ManageTutor record
        const tutor = new ManageTutor({ name, email, phone, subject, password });
        await tutor.save();

        // Hash password and create User record for login/auth
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            username: name,
            email,
            password: hashedPassword,
            role: "tutor",
            department: subject || "",
        });

        res.status(201).json(tutor);
    } catch (err) {
        console.error("Error adding tutor:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// ---------------- DELETE TUTOR ----------------
const deleteTutor = async (req, res) => {
    const { id } = req.params;

    try {
        const tutor = await ManageTutor.findById(id);
        if (!tutor) return res.status(404).json({ message: "Tutor not found" });

        await tutor.deleteOne();
        res.json({ message: "Tutor deleted successfully" });
    } catch (err) {
        console.error("Error deleting tutor:", err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getTutors, addTutor, deleteTutor };
