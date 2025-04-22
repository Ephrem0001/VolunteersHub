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

// Import all routes
const authRoutes = require('./routes/auth'); 
const eventsRoute = require("./routes/eventRoutes");
const adminRoute = require("./routes/adminRoutes");
const ngoRoutes = require("./routes/ngoRoutes");
const userRoutes = require("./routes/usersRoute");
const uprofileRoutes = require("./routes/uprofileRoutes");

// Middleware configuration
app.use(cors({
  origin: true, // reflect the request origin
  credentials: true
}));
app.options("*", cors());
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
app.use(mongoSanitize());
app.use(hpp());
app.use(cookieParser());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later"
}));

// Body Parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.static(path.join(__dirname, 'build')));
// Static File Serving
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res) => {
      res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "http://localhost:3000");
      res.header("Access-Control-Allow-Methods", "GET");
    }
  })
);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use("/api/events", eventsRoute);
app.use("/api/admin", adminRoute);
app.use("/api/ngo", ngoRoutes);
app.use("/api", userRoutes);
app.use("/api/volunteer", uprofileRoutes);

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