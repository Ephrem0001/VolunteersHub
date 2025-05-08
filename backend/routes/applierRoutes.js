const express = require("express");
const router = express.Router();
const Applier = require("../models/Applier");

router.get("/", async (req, res) => {
  try {
    const { eventCreatorId } = req.query;
    const appliers = await Applier.find({ eventCreatorId });
    res.json({ appliers });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch appliers" });
  }
});

module.exports = router;