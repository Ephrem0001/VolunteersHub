const express = require("express");
const multer = require("multer");
const Event = require("../models/Event");
const NGO = require("../models/NGO"); // Import the NGO model
const { verifyToken,verifyUser, verifyNGO, isNGO, verifyAdmin, isAdmin } = require("../middleware/authMiddleware");
const auth = require('../middleware/auth'); // Add this line
const nodemailer = require("nodemailer");
const router = express.Router();
const Applier = require("../models/Applier");
const contactController = require('../controllers/contactController');
const Volunteer = require("../models/Volunteer");
const admin = require("../models/admin");
const path = require('path'); // Add this line
const User = require('../models/User');

// Function to sanitize file names (replace spaces with underscores)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'belayketemateme44@gmail.com',
    pass: 'osrp pfgr pprv wgsz',
  },
});

// Function to sanitize file names (replace spaces with underscores)
const sanitizeFilename = (filename) => {
  return filename.replace(/\s+/g, "_"); // Replace spaces with underscores
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads')); // Use absolute path
  },
  filename: (req, file, cb) => {
    const sanitizedFilename = file.originalname.replace(/\s+/g, "_");
    cb(null, Date.now() + "-" + sanitizedFilename);
  },
});

const upload = multer({ storage });
  router.post("/create", verifyToken, verifyNGO, isNGO, upload.single("image"), async (req, res) => {
  try {
    const { name, description, date, location } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null; // Store image path

    const newEvent = new Event({
      name,
      description,
      date,
      location,
      image: imagePath,
      status: "pending", // Set status instead of approved: false
      createdBy: req.user.id, // Assign to the NGO creating it
    });

    await newEvent.save();
    res.status(201).json({ message: "Event created successfully! Pending admin approval." });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});
router.get('/my-events', verifyToken, async (req, res) => {
  try {
    // ... existing validation code ...
    
    const events = await Event.find({ createdBy: req.user.id })
      .sort({ date: 1 })
      .populate('likes', 'name email')
      .populate('comments.userId', 'name email');

    // Return just the array instead of wrapped object
    res.status(200).json(events);
    
  } catch (error) {
    console.error('Error fetching NGO events:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});
router.post('/contact', contactController.submitContactForm);

exports.getMyEvents = async (req, res) => {
  try {
      // Verify user is authenticated
      if (!req.user || !req.user.id) {
          return res.status(401).json({ 
              success: false,
              message: 'Unauthorized: User not authenticated'
          });
      }

      // Find events where user is the organizer OR attendee
      const events = await Event.find({
          $or: [
              { organizer: req.user.id },
              { attendees: req.user.id }
          ]
      })
      .populate('organizer', 'name email') // Include organizer details
      .populate('attendees', 'name email') // Include attendee details
      .sort({ date: 1 }); // Sort by date ascending

      if (!events || events.length === 0) {
          return res.status(200).json({ 
              success: true,
              message: 'No events found for this user',
              data: []
          });
      }

      res.status(200).json({
          success: true,
          count: events.length,
          data: events
      });

  } catch (error) {
      console.error('Error fetching user events:', error);
      res.status(500).json({
          success: false,
          message: 'Internal server error',
          error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
  }
};


router.post("/create", verifyToken, verifyNGO, isNGO, upload.single("image"), async (req, res) => {
  try {
    const { name, description, date, location } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null; // Store image path

    const newEvent = new Event({
      name,
      description,
      date,
      location,
      image: imagePath,
      status: "pending", // Set status instead of approved: false
      createdBy: req.user.id, // Assign to the NGO creating it
    });

    await newEvent.save();
    res.status(201).json({ message: "Event created successfully! Pending admin approval." });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

router.get("/", async (req, res) => {
  try {
    const events = await Event.find({ approved: true });
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Server error" });
}
});

/**
 * @route   GET /api/events/pending
 * @desc    Get all pending events (for admin approval)
 * @access  Admin only
 */
router.get("/pending", verifyToken, verifyAdmin, isAdmin, async (req, res) => {

  try {
    
    const pendingEvents = await Event.find({ status: "pending" });
    console.log(pendingEvents);
    res.status(200).json(pendingEvents);

  } catch (error) {
    console.error("Error fetching pending events:", error);
    res.status(500).json({ message: "Server error" });
  }
});


/**
 * @route   PUT /api/events/approve/:id
 * @desc    Admin approves an event
 * @access  Admin only
 * 
 * 
 * 
 */

const sendApprovalEmail = async (userEmail, eventName) => {
  try {
    if (!userEmail) {
      console.error("❌ Error: No recipient email provided!");
      return;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail, // Ensure this is not empty
      subject: "Event Approval Notification",
      text: `Hello, your event "${eventName}" has been successfully approved by the admin.`,
      html: `<p>Hello,</p>
             <p>Your event <strong>"${eventName}"</strong> has been successfully <b style="color: green;">approved</b> by the admin.</p>
             <p>Thank you for using our platform!</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email notification sent successfully!");
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};
// POST endpoint to add a new volunteer
router.post("/", async (req, res) => {
  try {
    console.log("Volunteer application request:", req.body);

    // Validate required fields
    const { name, sex, skills, age, eventId, eventCreatorId } = req.body;
    if (!name || !sex || !skills || !age || !eventId || !eventCreatorId) {
      return res.status(400).json({ 
        success: false,
        error: "All fields are required",
        requiredFields: ["name", "sex", "skills", "age", "eventId", "eventCreatorId"]
      });
    }

    if (isNaN(age)) {
      return res.status(400).json({ 
        success: false,
        error: "Age must be a number"
      });
    }
    

    // Check if the event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ 
        success: false,
        error: "Event not found" 
      });
    }

    // Create new volunteer application
    const newVolunteer = new Applier({
      name,
      sex,
      skills,
      age: parseInt(age),
      eventId,
      eventName: event.name,
      eventCreatorId,
      applicationDate: new Date()
    });

    // Save to database
    await newVolunteer.save();
    
    // Update event's volunteers count
    await Event.findByIdAndUpdate(eventId, { 
      $inc: { volunteersApplied: 1 } 
    });

    res.status(201).json({
      success: true,
      data: newVolunteer,
      message: "Volunteer application submitted successfully"
    });

  } catch (error) {
    console.error("Error in volunteer application:", error);
    res.status(500).json({ 
      success: false,
      error: "Internal server error",
      details: error.message 
    });
  }
});
router.get("/", async (req, res) => {
  const { creatorId, eventId, sortBy, search } = req.query;

  // Validate creatorId
  if (!creatorId || !mongoose.Types.ObjectId.isValid(creatorId)) {
    return res.status(400).json({ 
      success: false,
      message: "Valid creatorId is required" 
    });
  }

  try {
    // Build query
    const query = { eventCreatorId: creatorId };
    
    // Add eventId filter if provided
    if (eventId && mongoose.Types.ObjectId.isValid(eventId)) {
      query.eventId = eventId;
    }
    
    // Add search filter if provided
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } },
        { eventName: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort options
    const sortOptions = {};
    if (sortBy === 'name') sortOptions.name = 1;
    if (sortBy === 'age') sortOptions.age = 1;
    if (sortBy === 'recent') sortOptions.applicationDate = -1;

    // Execute query
    const volunteers = await Applier.find(query)
      .populate({
        path: 'eventId',
        select: 'name date location',
        model: 'Event'
      })
      .sort(sortOptions)
      .lean();

    // Format response data
    const formattedVolunteers = volunteers.map(volunteer => ({
      ...volunteer,
      eventName: volunteer.eventId?.name || volunteer.eventName,
      eventDate: volunteer.eventId?.date 
        ? new Date(volunteer.eventId.date).toLocaleDateString() 
        : 'Unknown',
      eventLocation: volunteer.eventId?.location || 'Unknown'
    }));

    res.json({
      success: true,
      count: formattedVolunteers.length,
      data: formattedVolunteers
    });

  } catch (error) {
    console.error("Error fetching volunteers:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch volunteers",
      error: error.message 
    });
  }
});

// For event deletion (assuming owners can delete their own events)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    // Check if event exists
    if (!event) {
      return res.status(404).json({ 
        success: false,
        message: "Event not found"
      });
    }
    
    // Check ownership (assuming createdBy stores user ID)
    if (event.createdBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this event"
      });
    }
    
    await event.deleteOne();
    
    res.json({
      success: true,
      message: "Event deleted successfully"
    });
    
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: "Server error during deletion"
    });
  }
});
// Renew an event
router.put('/renew/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if the requesting user is the creator of the event
    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to renew this event' });
    }

    // Only allow renewing approved or expired events
    if (event.status === 'pending') {
      return res.status(400).json({ error: 'Pending events cannot be renewed' });
    }

    if (event.status === 'rejected') {
      return res.status(400).json({ error: 'Rejected events cannot be renewed' });
    }

    const renewedEvent = await event.renew();
    res.json(renewedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});
// Backend (Express)
const updateEventStatus = async (req, res) => {
  const { id, status } = req.params; // Get the status ('approve' or 'reject')
  const event = await Event.findById(id);
  
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }
  
  if (status === 'approve') {
    event.status = 'approved';
    await event.save();
    // Send approval email
    await sendApprovalEmail(event);
    return res.status(200).json({ message: 'Event successfully approved' });
  }
  
  if (status === 'reject') {
    event.status = 'rejected';
    await event.save();
    // Send rejection email
    await sendRejectionEmail(event);
    return res.status(200).json({ message: 'Event successfully rejected' });
  }
  
  return res.status(400).json({ message: 'Invalid status' });
};

// Email Notification for rejection
const sendRejectionEmail = async (event) => {
  const user = await User.findById(event.createdBy); // Get the user's email
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your_email@gmail.com',
      pass: 'your_password',
    },
  });

  const mailOptions = {
    from: 'your_email@gmail.com',
    to: user.email,
    subject: 'Event Rejection Notification',
    text: `Sorry, your event "${event.name}" has been rejected by the admin.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Rejection email sent successfully');
  } catch (error) {
    console.error('Error sending rejection email:', error);
  }
};

router.put("/approve/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      console.error("❌ Event not found!");
      return res.status(404).json({ error: "Event not found" });
    }

    event.status = "approved"; // Update status
    await event.save();

    console.log("✅ Event approved:", event);

    // Fetch NGO email
    const ngo = await NGO.findById(event.createdBy);
    if (!ngo || !ngo.email) {
      console.error("❌ NGO email not found!");
      return res.status(400).json({ error: "NGO email not found" });
    }

    console.log("📧 Sending email to:", ngo.email);

    await sendApprovalEmail(ngo.email, event.name);
    res.json({ message: "Event approved successfully. Approval email sent to NGO." });
  } catch (error) {
    console.error("❌ Error approving event:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//   await sendApprovalEmail(ngo.email, event.name);
// res.json({ message: "Event approved successfully" });
router.get("/approved", async (req, res) => {
  try {
    // Fetch approved events and include volunteers array
    const events = await Event.find({ status: "approved" });

    // Map events to include full image URL and volunteers count
    const eventsWithDetails = events.map((event) => ({
      ...event._doc,
      image: event.image ? `http://localhost:5000${event.image}` : null,
      volunteersRegistered: event.volunteers ? event.volunteers.length : 0, // Add volunteers count
    }));

    res.status(200).json(eventsWithDetails);
  } catch (error) {
    console.error("Error fetching approved events:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:eventId", async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId); // Find event by ID
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Prepend the base URL to the image path
    const eventWithFullImageUrl = {
      ...event._doc,
      image: `http://localhost:5000${event.image}`,
    };

    console.log("Event details:", eventWithFullImageUrl); // Log the event details
    res.status(200).json(eventWithFullImageUrl); // Return the event details
  } catch (error) {
    console.error("Error fetching event details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/rejected", async (req, res) => {
  try {
    const { status } = req.body;
    const rejectedEvents = await Event.find({ status });
    res.status(200).json(rejectedEvents);
  } catch (error) {
    console.error("Error fetching rejected events:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Disapprove event
router.put("/disapprove/:id", async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { status: "pending" },  // Change the status to 'pending'
      { new: true }
    );
    if (!updatedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("Error disapproving event:", error);
    res.status(500).json({ error: "Failed to disapprove event" });
  }
});


router.put("/unreject/:id", async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { status: "pending" },
      { new: true }
    );
    if (!updatedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("Error unrejecting event:", error);
    res.status(500).json({ error: "Failed to unreject event" });
  }
});


router.put("/reject/:id", async (req, res) => {
  try {
    console.log(`Received request to reject event with ID: ${req.params.id}`);

    // Fetch the event by its ID
    const event = await Event.findById(req.params.id);
    if (!event) {
      console.log("Event not found");
      return res.status(404).json({ error: "Event not found" });
    }

    console.log("Event found:", event);

    // Find NGO using event.createdBy
    const ngo = await NGO.findById(event.createdBy); // Assuming createdBy stores NGO ID
    if (!ngo || !ngo.email) {
      console.log("NGO email not found.");
      return res.status(400).json({ error: "NGO email not found" });
    }

    console.log("NGO found:", ngo);

    // Update the status to 'rejected'
    event.status = "rejected";  
    await event.save();

    console.log("Event successfully rejected:", event);

    // Send email notification to the NGO
    console.log("Sending rejection email to:", ngo.email);

    // Configure Nodemailer
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your app password
      },
    });

    // Email content
    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: ngo.email,
      subject: "Your Event Has Been Rejected",
      text: `Hello ${ngo.name},\n\nYour event "${event.name}" has been rejected. If you have any questions, please contact support.\n\nThank you.`,
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Rejection Email sent:", info.response);
      }
    });

    // Return the updated event
    res.status(200).json({ message: "Event rejected successfully! Rejection Email sent to users", event });
  } catch (error) {
    console.error("Error rejecting event:", error);
    res.status(500).json({ error: "Failed to reject event" });
  }
});

// 📌 Get All Volunteers for an Event
router.get("/:eventId", async (req, res) => {
  try {
    const volunteers = await Volunteer.find({ eventId: req.params.eventId });
    res.status(200).json(volunteers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching volunteers", error });
  }
});

// Update volunteer status (Approve/Reject)
router.put("/:id", async (req, res) => {
  try {
    const updatedVolunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true } // Returns updated document
    );
    res.status(200).json(updatedVolunteer);
  } catch (error) {
    res.status(500).json({ message: "Error updating volunteer status", error });
  }
});

// DELETE: Delete an event by ID
router.delete("/delete/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;

    // Find and delete the event
    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.put('/events/:id', verifyToken, async (req, res) => {
  const { name, description, date, location, image, status } = req.body;
  console.log(req.body)

  try {
    // Find the event by ID
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if the user is the creator of the event
    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to edit this event' });
    }

    // Update fields
    event.name = name || event.name;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;
    event.image = image || event.image; // Optional field
    event.status = status || event.status; // Optional field

    // Save the updated event
    await event.save();

    res.status(200).json({ message: 'Event updated successfully', event });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});
router.post("/:eventId/register", verifyToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Prevent duplicate applications by the same user for the same event
    const existing = await Applier.findOne({
      eventId: event._id,
      name: req.body.name, // or use req.user.id if you want to restrict by user
    });
    if (existing) {
      return res.status(400).json({ message: "Already registered" });
    }

    // Save volunteer form info in Applier collection
    const applier = new Applier({
      name: req.body.name,
      sex: req.body.sex,
      skills: req.body.skills,
      age: req.body.age,
      eventId: event._id,
      eventCreatorId: event.createdBy,
    });
    await applier.save();

    res.json({ message: "Registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
});
// Like or Unlike an event
router.post("/:eventId/like", async (req, res) => {
  try {
    const { eventId } = req.params;
    const { userId, like } = req.body; // like: true to like, false to unlike

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    const alreadyLiked = event.likes.includes(userId);

    if (like && !alreadyLiked) {
      event.likes.push(userId);
    } else if (!like && alreadyLiked) {
      event.likes = event.likes.filter(id => id.toString() !== userId);
    }

    await event.save();
    res.json({ likes: event.likes });
  } catch (error) {
    res.status(500).json({ error: "Failed to update like" });
  }
});

// Get likes for an event
router.get("/:eventId/likes", async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json({ likes: event.likes });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch likes" });
  }
});
// Add a comment to an event
router.post("/:eventId/comments", async (req, res) => {
  try {
    const { eventId } = req.params;
    const { text, author, authorId, avatar } = req.body;

    if (!text || !author || !authorId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Add comment to event
    const comment = {
      userId: authorId,
      text,
      author,
      avatar,
      createdAt: new Date()
    };
    if (!event.comments) event.comments = [];
    event.comments.push(comment);
    await event.save();

    res.json({ comments: event.comments });
  } catch (error) {
    res.status(500).json({ error: "Failed to add comment" });
  }
});

// Get comments for an event
router.get("/:eventId/comments", async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json({ comments: event.comments || [] });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

router.get("/:eventId/is-registered", verifyToken, async (req, res) => {
  try {
    const eventId = req.params.eventId;
    // Use req.user.name or req.user.id depending on your Applier schema
    const applier = await Applier.findOne({ eventId, name: req.user.name });
    res.json({ registered: !!applier });
  } catch (error) {
    res.status(500).json({ registered: false });
  }
});


module.exports = router;
