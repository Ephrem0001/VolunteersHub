const jwt = require("jsonwebtoken");
const Admin = require("../models/admin"); // Import the Admin model
const secretKey = "your_secret_key"; // Replace with your actual secret key

const verifyToken2 = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Access Denied: No token provided" });
  }

  try {
    const verified = jwt.verify(token.replace("Bearer ", ""), secretKey);
    const admin = await Admin.findById(verified.id); // Query the Admin collection

    if (!admin) {
      console.error("Admin not found in database");
      return res.status(401).json({ message: "Invalid token: Admin not found" });
    }

    req.user = admin; // Attach admin data to the request object
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { verifyToken2 };
