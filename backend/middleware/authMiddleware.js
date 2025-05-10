const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const NGO = require("../models/NGO");
const User= require("../models/User");

// Make sure you're using the correct secret key
const secretKey = process.env.JWT_SECRET || 'your-secret-key'; 

const verifyToken = async (req, res, next) => {
  console.log("Current Secret Key:", secretKey);
  
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access Denied: No token provided" });

  try {
    const tokenValue = token.startsWith("Bearer ") ? token.split(" ")[1] : token;
    const decoded = jwt.verify(tokenValue, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: "Your session has expired. Please log in again.",
        code: "SESSION_EXPIRED"
      });
    }
    console.error("Token verification error:", error);
    res.status(401).json({ 
      message: "Invalid token",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
/**
 * Verify Admin Middleware
 */
const verifyAdmin = async (req, res, next) => {
  try {
    // First check if user has admin role in token
    if (req.user.role.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Admin privileges required" });
    }

    // Then verify admin exists in database (optional)
    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found in database" });
    }

    // Attach full admin document to request
    req.admin = admin;
    next();
  } catch (error) {
    console.error("Admin verification error:", error);
    res.status(500).json({ message: "Server error during admin verification" });
  }
};

/**
 * Verify NGO Middleware
 */
const verifyNGO = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'ngo') {
      return res.status(403).json({ 
        message: "Only registered NGOs can perform this action" 
      });
    }
    
    // The NGO document is already attached as req.user.model
    next();
  } catch (error) {
    console.error("NGO verification error:", error);
    res.status(500).json({ 
      message: "Server error during NGO verification",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Role-Based Middleware for Admins
 */
// In your isAdmin middleware
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role.toLowerCase() !== "admin") {  // Case insensitive check
    return res.status(403).json({ message: "Access denied. Only admins are allowed." });
  }
  next();
};

/**
 * Role-Based Middleware for NGOs
 */
const isNGO = (req, res, next) => {
  if (!req.user || req.user.role !== "ngo") {
    return res.status(403).json({ message: "Access denied. Only NGOs are allowed." });
  }
  next();
};

module.exports = { verifyToken, verifyAdmin, verifyNGO, isAdmin, isNGO };
