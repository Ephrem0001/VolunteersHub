const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Volunteer = require("../models/Volunteer");
const NGO = require("../models/NGO");
const multer = require("multer");
const Event = require("../models/Event");
const { sendVerificationEmail } = require("../utils/emailService"); // You need to create this utility
const { generateVerificationToken } = require("../utils/tokenUtils"); // You need to create this utility
const { verifyToken, verifyNGO } = require("../middleware/authMiddleware");
const nodemailer = require("nodemailer");
const Admin = require("../models/admin");
const crypto = require('crypto');
const admin = require("../models/admin");
const secretKey = process.env.JWT_SECRET ; // Use environment variable for security
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "belayketemateme44@gmail.com",  // 🔹 Your email
    pass: "osrp pfgr pprv wgsz",  // 🔹 Your app password (not normal password!)
  },
});

// Function to send confirmation email after password change
const sendPasswordChangedEmail = async (email) => {
  const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Changed Successfully",
      text: "Your password has been changed successfully. If you did not make this change, please contact support.",
  };

  try {
      await transporter.sendMail(mailOptions);
  } catch (error) {
      console.error("Error sending password changed email:", error);
      throw new Error("Email could not be sent");
  }
};

module.exports = { sendPasswordChangedEmail };
const router = express.Router();
router.post("/register/volunteer", async (req, res) => {
  const { name, email, password } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check for existing user
    const existingNGO = await NGO.findOne({ email });
    const existingVolunteer = await Volunteer.findOne({ email });

    if (existingNGO || existingVolunteer) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate token
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Create and save volunteer
    const newVolunteer = new Volunteer({
      name,
      email,
      password: hashedPassword,
      role: "volunteer",
      verified: false,
      verificationToken: token, // Store token in the database if needed
    });

    await newVolunteer.save();

    // Send verification email (non-blocking)
    const verificationLink = `http://localhost:3000/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email",
      html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
    }).catch(err => console.error("Email error:", err));

    res.status(201).json({ message: "Registration successful! Check your email." });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ 
      message: "Server error",
      error: error.message // Include for debugging (remove in production)
    });
  }
});

  router.post("/register/admin", async (req, res) => {
    const { name, email, password } = req.body;
  
    console.log(name,email)
    try {
      // Check if email already exists in NGO or Volunteer collections
      // const existingAdmin= await NGO.findOne({ email });
      const existingAdmin = await admin.findOne({ email });
  
      if (existingAdmin) {
        return res.status(400).json({ message: "Email already registered" });
      }
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      // Create a new Volunteer
      const newAdmin = new Admin({
        name,
        email,
        password,
        role: "admin",
      });
  
      await newAdmin.save();
      res.status(201).json({ message: "admin registered successfully!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error. Please try again later." });
    }
  });
 
router.put("/profile/update", verifyToken, async (req, res) => {
  const { name, email, currentPassword, newPassword, organization, description } = req.body; // <-- add organization, description

  try {
    let user;

    // Determine user role and fetch user
    if (req.user.role === "volunteer") {
      user = await Volunteer.findById(req.user.id);
    } else if (req.user.role === "ngo") {
      user = await NGO.findById(req.user.id);
    } else if (req.user.role === "admin") {
      user = await Admin.findById(req.user.id);
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password if changing password
    if (newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    // Update other fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (organization) user.organization = organization; // <-- add this line
    if (description) user.description = description;     // <-- add this line

    await user.save();

    // Return updated user (without password)
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({ 
      message: "Profile updated successfully",
      user: userResponse
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// ...existing code...
router.post("/register/ngo", async (req, res) => {
  const { name, email, password, organization } = req.body;

  try {
    // Validate input
    if (!name || !email || !password || !organization) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check for existing user
    const existingUser = await NGO.findOne({ email }) || await Volunteer.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password and create token
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Create NGO
    const newNGO = new NGO({
      name,
      email,
      password: hashedPassword,
      organization,
      role: "ngo",
      verificationToken, // Store token in the database if needed
      verificationExpires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    });

    await newNGO.save();

    // Create verification link
    const verificationLink = `http://localhost:3000/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;

    // Send email
    await transporter.sendMail({
      from: `"Your App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email",
      html: `
        <p>Hello ${name},</p>
        <p>Please click the link below to verify your email:</p>
        <a href="${verificationLink}">Verify Email</a>
        <p>This link expires in 24 hours.</p>
      `,
    });

    res.status(201).json({ 
      success: true,
      message: "Registration successful! Please check your email.",
      email
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error during registration",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const cleanEmail = email.trim().toLowerCase();

  console.log("Login attempt for:", cleanEmail);
  
  try {
    // 1. Find user in all collections
    const user = await Volunteer.findOne({ email: cleanEmail }) || 
                await NGO.findOne({ email: cleanEmail }) || 
                await Admin.findOne({ email: cleanEmail });

    if (!user) {
      console.log("User not found");
      return res.status(401).json({ 
        success: false,
        message: "Invalid credentials" 
      });
    }

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch");
      return res.status(401).json({ 
        success: false,
        message: "Invalid credentials" 
      });
    }

    // 3. Check if email is verified (if your system requires it)
    if (user.verified !== true) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email first"
      });
    }

    // 4. Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role || 'volunteer' // Default role
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // 5. Return user data (without sensitive info)
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      verified: user.verified
    };

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: userData
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error during login",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});
router.get('/verify-email', async (req, res) => {
  const { token, email } = req.query;

  try {
      if (!token || !email) {
          return res.status(400).json({ message: 'Token and email are required.' });
      }

      const decodedEmail = decodeURIComponent(email);
      const user = await Volunteer.findOne({ email: decodedEmail, verificationToken: token }) ||
                   await NGO.findOne({ email: decodedEmail, verificationToken: token });

      if (!user) {
          return res.status(400).json({ message: 'Invalid or expired token.' });
      }

      user.verified = true;
      user.verificationToken = undefined;
      await user.save();

      res.redirect(`${process.env.FRONTEND_URL}/login`);
  } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).json({ message: 'Server error during verification.' });
  }
});

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Images will be stored in an 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = multer({ storage });

// @route  POST /api/events/create
// @desc   NGO creates an event (default approved: false)
// @access NGO (protected)
router.post("/events/create", verifyToken, verifyNGO, upload.single("image"), async (req, res) => {
  try {
    const { name, description, startDate, endDate, location } = req.body;
    
    // Validate dates
    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({ message: "End date must be after start date" });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const newEvent = new Event({
      name,
      description,
      startDate,
      endDate,
      location,
      image: imagePath,
      status: "pending",
      createdBy: req.user.id,
    });

    await newEvent.save();
    res.status(201).json({ 
      message: "Event created successfully! Pending admin approval.",
      event: newEvent 
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// @route  GET /api/events
// @desc   Get all events (only approved ones)
// @access Public
router.get("/", async (req, res) => {
    try {
        const events = await Event.find({ approved: true });
        res.status(200).json(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// @route  GET /api/events/pending
// @desc   Get all pending events (for admin approval)
// @access Admin only
router.get("/pending", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const pendingEvents = await Event.find({ approved: false })
      .populate('createdBy') // Assuming createdBy is an ObjectId reference to the User model
      .exec();

    res.status(200).json(pendingEvents);
  } catch (error) {
    console.error("Error fetching pending events:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/verify-email", async (req, res) => {
  const { token, email } = req.query;

  if (!token || !email) {
      return res.status(400).json({ message: 'Token and email are required.' });
  }

  try {
      const decodedEmail = decodeURIComponent(email);
      const user = await Volunteer.findOne({ email: decodedEmail, verificationToken: token }) ||
                   await NGO.findOne({ email: decodedEmail, verificationToken: token });

      if (!user) {
          return res.status(404).json({ message: 'Invalid or expired token.' });
      }

      user.verified = true;
      user.verificationToken = undefined; // Clear the token
      await user.save();

      res.redirect(`${process.env.FRONTEND_URL}/login`);
  } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).json({ message: 'Server error during verification.' });
  }
});



// @route  PUT /api/events/approve/:id
// @desc   Admin approves an event
// @access Admin only
router.put("/approve/:id", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const eventId = req.params.id;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Mark event as approved
    event.approved = true;
    await event.save();

    // Fetch the user who created the event (assuming createdBy is a reference to the User model)
    const user = await User.findById(event.createdBy);

    // Send an email to the NGO (event creator)
    const mailOptions = {
      from: 'your-email@gmail.com', // Sender's email
      to: user.email,              // Recipient's email (NGO's email)
      subject: 'Event Approval Notification',
      text: `Hello ${user.name},\n\nYour event "${event.name}" has been approved! You can now proceed with further steps.\n\nBest regards,\nEvent Management Team`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Error sending email' });
      }
      console.log('Email sent: ' + info.response);
    });

    res.status(200).json({ message: "Event approved and email sent" });
  } catch (error) {
    console.error("Error approving event:", error);
    res.status(500).json({ message: "Server error" });
  }
});


router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);

    let user = await Volunteer.findOne({ email });
    let userType = 'volunteer';

    if (!user) {
      user = await NGO.findOne({ email });
      userType = 'ngo';

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'No account with that email exists',
        });
      }
    }

    console.log(user);
    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    // Send email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await transporter.sendMail({
      to: user.email,
      subject: 'Password Reset Request',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      ${resetUrl}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    });

    console.log(`[${userType}] Reset Token:`, resetToken);

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to email',
      token: resetToken // For dev only
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing forgot password request'
    });
  }
});


// Validate reset token endpoint
router.get('/validate-reset-token/:token', async (req, res) => {
  try {
    const { token } = req.params;

    // Check in both collections
    const user = await Volunteer.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    }) || await NGO.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    res.status(200).json({ success: true, valid: true });

  } catch (error) {
    console.error('Validate Token Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});// Reset password endpoint
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    let user = await Volunteer.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    let userType = 'volunteer';

    if (!user) {
      user = await NGO.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid or expired token' });
      }

      userType = 'ngo';
    }

    // Hash the new password
    user.password = await bcrypt.hash(password, 10); // Hashing the new password
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Optionally: send confirmation email
    await sendPasswordChangedEmail(user.email);

    res.status(200).json({ success: true, message: 'Password updated successfully', userType });

  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
router.get("/profile", verifyToken, async (req, res) => {
  let user;
  if (req.user.role === "volunteer") {
    user = await Volunteer.findById(req.user.id);
  } else if (req.user.role === "ngo") {
    user = await NGO.findById(req.user.id);
  } else if (req.user.role === "admin") {
    user = await Admin.findById(req.user.id);
  }
  if (!user) return res.status(404).json({ message: "User not found" });
  const userResponse = user.toObject();
  delete userResponse.password;
  res.json({ user: userResponse });
});

// Add this debug route for admin login
router.post("/debug-admin-login", async (req, res) => {
  const { email, password } = req.body;
  
  try {
    console.log("Debug admin login attempt for:", email);
    
    // Find the admin user
    const admin = await Admin.findOne({ email });
    
    if (!admin) {
      console.log("Admin not found for email:", email);
      return res.status(404).json({ message: "Admin not found" });
    }
    
    console.log("Admin found:", admin);
    
    // Force update the admin to have the role field
    admin.role = "admin";
    await admin.save();
    console.log("Admin updated with role field:", admin);
    
    // Create token with admin role explicitly set
    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        role: "admin" // Explicitly set role to admin
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: '30d' }
    );
    
    // Log the token content for debugging
    console.log("Token payload:", { id: admin._id, email: admin.email, role: "admin" });
    
    res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      user: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: "admin",
        verified: true
      }
    });
  } catch (error) {
    console.error("Debug admin login error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error during login",
      error: error.message
    });
  }
});

module.exports = router;
