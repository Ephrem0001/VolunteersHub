const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true, // Normalize email to lowercase
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "admin",
    },
    verified: { type: Boolean, default: false }, // Add this field
    verificationToken: { type: String }, // Add this field
}, { timestamps: true });

module.exports = mongoose.model("Admin", adminSchema);