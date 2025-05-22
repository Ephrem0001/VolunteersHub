const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // New recommended options for Mongoose 6+
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn; // Return the connection object
  } catch (err) {
    console.error('❌ MongoDB Connection was Failed:', err);
    console.log('Connection URI:', process.env.MONGO_URI);
    // Exit with failure
    process.exit(1);
  }
};

module.exports = connectDB;