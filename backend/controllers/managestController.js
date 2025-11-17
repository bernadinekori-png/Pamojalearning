const ManageStudent = require('../models/managest');

// ---------------- GET ALL STUDENTS ----------------
const getStudents = async (req, res) => {
    try {
        const students = await ManageStudent.find().sort({ createdAt: -1 });
        res.json(students);
    } catch (err) {
        console.error("Error fetching students:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// ---------------- ADD NEW STUDENT ----------------
const addStudent = async (req, res) => {
    const { name, email, phone, course, password } = req.body;

    if (!name || !email || !phone || !course || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Check if email already exists
        const existing = await ManageStudent.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const student = new ManageStudent({ name, email, phone, course, password });
        await student.save();

        res.status(201).json(student);
    } catch (err) {
        console.error("Error adding student:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// ---------------- DELETE STUDENT ----------------
const deleteStudent = async (req, res) => {
    const { id } = req.params;

    try {
        const student = await ManageStudent.findById(id);
        if (!student) return res.status(404).json({ message: "Student not found" });

        await student.deleteOne(); // Works in Mongoose 7

        res.json({ message: "Student deleted successfully" });
    } catch (err) {
        console.error("Error deleting student:", err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getStudents, addStudent, deleteStudent };
