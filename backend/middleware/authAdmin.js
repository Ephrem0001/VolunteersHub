// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");

  // Log the token for debugging purposes
  console.log("Token received:", token);

  if (!token) {
    return res.status(401).json({ message: "Access Denied" });
  }

  // Check if the token is in the 'Bearer <token>' format
  const tokenValue = token.startsWith("Bearer ") ? token.split(" ")[1] : token;

  try {
    // Verify the token
    const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);
    req.admin = decoded; // Store admin info in request object
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(400).json({ message: "Invalid Token" });
  }
};

module.exports = { verifyToken };
