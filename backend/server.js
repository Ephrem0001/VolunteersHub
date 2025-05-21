require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const { checkExpiredEvents } = require("./models/Event");
const analyticsRoutes = require('./routes/analyticsRoutes');
const { startReminderService } = require('./services/eventReminderService');
startReminderService();
// Initialize Express app
const app = express();

// Import all routes
const authRoutes = require('./routes/auth'); 
const eventsRoute = require("./routes/eventRoutes");
const adminRoute = require("./routes/adminRoutes");
const ngoRoutes = require("./routes/ngoRoutes");
const userRoutes = require("./routes/usersRoute");
const uprofileRoutes = require("./routes/uprofileRoutes");
const edit = require("./routes/edit")
const contactRoutes = require('./routes/contact');
const applierRoutes = require("./routes/applierRoutes");
const admin = require('./routes/admin'); // Adjust path as needed// Middleware configuration
// Replace your current CORS configuration with this:
// Replace your current CORS configuration with this:
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://volunteershub-project.onrender.com',
      'https://volunteershub-754.onrender.com',
      'https://eventmannagemnt-1.onrender.com',
      'http://localhost:3000'
    ];
    
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'x-access-token'],
  credentials: true,
  optionsSuccessStatus: 204,
  exposedHeaders: ['Content-Disposition'] // Add this line
};
// Use this single CORS configuration
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable preflight for all routes
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Changed from false
  contentSecurityPolicy: {
    directives: {
      "default-src": ["'self'"],
      "connect-src": ["'self'", "https://*.render.com"],
      "img-src": ["'self'", "data:", "blob:", "https://*.render.com", "http://*.render.com"],
      "script-src": ["'self'", "'unsafe-inline'"],
      "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      "font-src": ["'self'", "https://fonts.gstatic.com"]
    }
  }
}));

app.get('/images/:filename', (req, res) => {
  const { filename } = req.params;
  res.sendFile(path.join(__dirname, 'uploads', filename), {
    headers: {
      'Cross-Origin-Resource-Policy': 'cross-origin',
      'Cache-Control': 'public, max-age=31536000'
    }
  });
});
// Add to your routes section
app.get('/api/users/:id/stats', async (req, res) => {
  try {
    const stats = {
      eventsAttended: Math.floor(Math.random() * 20),
      hoursVolunteered: Math.floor(Math.random() * 100),
      upcomingEvents: Math.floor(Math.random() * 5),
      impactPoints: Math.floor(Math.random() * 500)
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});
app.use(mongoSanitize());
app.use(hpp());
app.use(cookieParser());
app.use(rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 300, // 300 requests per 5 minutes per IP
  message: "Too many requests from this IP, please try again later"
}));
// Add this near your imports

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // allow 100 login attempts per 10 minutes per IP
  message: "Too many login attempts. Please try again later."
});

app.use('/api/auth/login', loginLimiter);

const generalLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 300,
  message: "Too many requests from this IP, please try again later"
});
app.use(generalLimiter);

// Apply only to login route
app.use('/api/auth/login', loginLimiter);
// Body Parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.static(path.join(__dirname, 'build')));
// Static File Serving
// Update your static file serving in server.js
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use("/api/events", eventsRoute);
app.use("/api/admin", adminRoute);
app.use("/api/ngo", ngoRoutes);
app.use("/api", userRoutes);

app.use("/api/volunteer", uprofileRoutes);
app.use("/api/edit",edit)
app.use('/api/contact', contactRoutes);
app.use("/api/appliers", applierRoutes);
app.use('/api/admin', admin);
// Health endpoints
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Scheduled tasks
if (process.env.NODE_ENV !== "test") {
  const cron = require("node-cron");
  cron.schedule("0 0 * * *", async () => {
    console.log("Checking for expired events...");
    try {
      const result = await checkExpiredEvents();
      console.log(`Marked ${result.nModified} events as expired`);
    } catch (error) {
      console.error("Error checking expired events:", error);
    }
  });
}

// Server startup function
async function startServer() {
  try {
    await connectDB();
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the application
startServer();

// Handle uncaught rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});