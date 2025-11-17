const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const TutorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  department: {
    type: String,
    trim: true,
    default: "",
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  photo: {
    type: String,
    default: "",
  }
}, { 
  timestamps: true,
  collection: "tutors" // <- THIS LINE ensures Mongoose uses the correct collection
});

// Hash password before save (only when modified)
TutorSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  } catch (err) {
    next(err);
  }
});

// instance method to compare password
TutorSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Tutor", TutorSchema);
