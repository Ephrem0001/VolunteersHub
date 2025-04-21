const express = require("express");
const router = express.Router();
const NGO = require("../models/NGO");

// Fetch all NGOs
router.get("/ngo-users", async (req, res) => {
  try {
    const ngos = await NGO.find();
    res.json(ngos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete NGO User
router.delete("/ngo-users/:id", async (req, res) => {
  try {
    await NGO.findByIdAndDelete(req.params.id);
    res.json({ message: "NGO deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Block/Unblock NGO User
router.patch("/ngo-users/:id", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["active", "blocked"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updatedNGO = await NGO.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(updatedNGO);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
