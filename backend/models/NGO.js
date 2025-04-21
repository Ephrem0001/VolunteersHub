const mongoose = require("mongoose");

const ngoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  organization: { type: String, required: true },
  role: { type: String, enum: ["ngo"], required: true, default: "ngo" },
  status: { type: String, enum: ["active", "blocked"], default: "active" },
  createdAt: { type: Date, default: Date.now },
  verified: { type: Boolean, default: false }, // Add this field
  verificationToken: { type: String }, // Add this field
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
});

const NGO = mongoose.model("NGO", ngoSchema);

module.exports = NGO;
