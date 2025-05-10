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

module.exports = router;