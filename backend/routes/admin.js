const express = require('express');
const router = express.Router();
const Admin = require("../models/admin");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

// GET admin profile
router.get('/profile', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const adminUser = await Admin.findById(req.user.id).select('-password');
    if (!adminUser) return res.status(404).json({ message: "Admin not found" });
    res.json({ user: adminUser });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT update admin profile
router.put('/profile', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { name, email } = req.body;
    const adminUser = await Admin.findById(req.user.id);
    
    if (!adminUser) {
      return res.status(404).json({ 
        success: false,
        message: "Admin not found" 
      });
    }

    if (name) adminUser.name = name;
    if (email) adminUser.email = email;

    await adminUser.save();

    const adminObj = adminUser.toObject();
    delete adminObj.password;
    delete adminObj.resetPasswordToken;
    delete adminObj.verificationToken;

    res.json({ 
      success: true,
      message: "Profile updated successfully", 
      user: adminObj 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message.includes("validation failed") 
        ? "Invalid data format" 
        : "Server error" 
    });
  }
});

router.put('/change-password', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate password length
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters"
      });
    }

    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      return res.status(404).json({ 
        success: false,
        message: "Admin not found" 
      });
    }

    // Verify current password
    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect"
      });
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    res.json({
      success: true,
      message: "Password updated successfully"
    });

  } catch (err) {
    console.error("Password change error:", err);
    res.status(500).json({
      success: false,
      message: "Server error during password update"
    });
  }
});
module.exports = router;