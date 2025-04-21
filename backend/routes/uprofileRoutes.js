const express = require("express");
const router = express.Router();
const Profile = require("../models/Profile");
const auth = require("../middleware/auth"); // Add authentication middleware
// POST /api/volunter/profile - Save profile
// POST /api/volunter/profile - Save profile
router.post("/profile", auth, async (req, res) => {
  const { image, skills, interests, hasExperience } = req.body;

  try {
    // Check if a profile already exists for the user
    let profile = await Profile.findOne({ userId: req.user.id });

    if (profile) {
      // Update existing profile
      profile.image = image;
      profile.skills = skills;
      profile.interests = interests;
      profile.hasExperience = hasExperience;
    } else {
      // Create a new profile
      profile = new Profile({
        userId: req.user.id,
        image,
        skills,
        interests,
        hasExperience,
      });
    }

    // Save the profile to the database
    const savedProfile = await profile.save();

    // Return the saved profile
    res.status(201).json(savedProfile);
  } catch (error) {
    console.error("Error saving profile:", error);
    res.status(500).json({ message: "Failed to save profile" });
  }
});
// GET /api/volunter/profile - Fetch profile
router.get("/profile", auth, async (req, res) => {
  try {
    // Fetch the profile for the logged-in user
    const profile = await Profile.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});



module.exports = router;