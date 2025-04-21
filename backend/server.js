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

// Initialize Express app
const app = express();

// Connect to database
connectDB();
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

// Then add OPTIONS handler right after
app.options("*", cors());

// THEN add security middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: {
    directives: {
      "default-src": ["'self'"],
      "connect-src": ["'self'", process.env.FRONTEND_URL || "http://localhost:3000"],
      "img-src": ["'self'", "data:", "blob:"],
      "script-src": ["'self'", "'unsafe-inline'"],
      "style-src": ["'self'", "'unsafe-inline'"]
    }
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later"
});

// Import all routes at the top (only once)
const authRoutes = require('./routes/auth'); 
const eventsRoute = require("./routes/eventRoutes");
const adminRoute = require("./routes/adminRoutes");
const ngoRoutes = require("./routes/ngoRoutes");
const userRoutes = require("./routes/usersRoute");
const uprofileRoutes = require("./routes/uprofileRoutes");

// Middleware configuration
app.use(mongoSanitize());
app.use(hpp());
app.use(cookieParser());
app.use(limiter);

// Body Parsers with increased limit
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static File Serving with proper headers
// Static File Serving with proper headers
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res) => {
      res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "http://localhost:3000");
      res.header("Access-Control-Allow-Methods", "GET");
    }
  }) // This was the missing closing parenthesis
);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use("/api/events", eventsRoute);
app.use("/api/admin", adminRoute);
app.use("/api/ngo", ngoRoutes);
app.use("/api", userRoutes);
app.use("/api/volunteer", uprofileRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// Root endpoint
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Schedule expired events check (runs daily at midnight)
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

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});