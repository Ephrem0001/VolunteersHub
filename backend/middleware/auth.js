
// utils/authMiddleware.js
const jwt = require("jsonwebtoken");
const NGO = require("../models/NGO");
const User = require("../models/User");

const authenticate = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const token = authHeader.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Invalid token format" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Unified user lookup (works for both User and NGO)
    const user = await User.findById(decoded.id) || await NGO.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized: Account not found" });
    }

    // Standardized request attachment
    req.authUser = {
      id: user._id,
      role: user.role || 'user', // Default role if not specified
      modelType: user instanceof NGO ? 'ngo' : 'user'
    };
    
    next();
  } catch (err) {
    console.error("Auth error:", err);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Session expired. Please login again" });
    }
    res.status(401).json({ error: "Invalid authentication" });
  }
};
module.exports = authenticate;