const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["volunteer"], required: true, default: "volunteer" },
  status: { type: String, enum: ["active", "blocked"], default: "active" },
  createdAt: { type: Date, default: Date.now },
  verified: { type: Boolean, default: false }, // Add this field
  verificationToken: { type: String }, // Add this field
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
});

const Volunteer = mongoose.model("Volunteer", volunteerSchema);

module.exports = Volunteer;