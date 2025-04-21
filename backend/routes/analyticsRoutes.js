const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin, isNGO } = require("../middleware/authMiddleware");
const analyticsController = require("../controllers/analyticsController");

// Main dashboard stats - accessible to all authenticated users
router.get("/dashboard", verifyToken, analyticsController.getDashboardStats);

// Volunteer analytics - admin only
router.get("/volunteers", verifyToken, isAdmin, analyticsController.getVolunteerAnalytics);

// Event analytics - admin sees all, NGO sees their own
router.get("/events", verifyToken, analyticsController.getEventAnalytics);

module.exports = router;