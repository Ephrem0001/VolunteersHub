const express = require("express");
const User = require("../models/User"); // Import the User model
const Volunteer = require("../models/Volunteer");
const { verifyToken, verifyAdmin, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

// Fetch all users (excluding passwords)
router.get("/users", async (req, res) => {
  try {
    const users = await Volunteer.find({}, { password: 0 }); // Exclude password field
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// Add this route to get user count
// Delete a user
router.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await Volunteer.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
});



// Block/Unblock a user
// Add this to your user routes
// Block/Unblock a volunteer
router.patch('/volunteers/:id/status', verifyToken, verifyAdmin, isAdmin, async (req, res) => {
  try {
    const { status } = req.body; // Expecting 'active' or 'blocked'
    
    if (!['active', 'blocked'].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const user = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { status }, // Update the status field
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    res.status(200).json({ 
      message: `Volunteer ${status === 'blocked' ? 'blocked' : 'unblocked'} successfully`,
      user: { 
        _id: user._id,
        name: user.name,
        email: user.email,
        status: user.status 
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating volunteer status", error });
  }
});
module.exports = router;