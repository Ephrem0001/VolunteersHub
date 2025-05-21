const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true }, // Changed from date to startDate
  endDate: { type: Date, required: true },  // Added endDate
  location: { type: String, required: true },
  image: { type: String, required: false },
  status: { 
    type: String, 
    enum: ["pending", "approved", "rejected"], 
    default: "pending" 
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [{ 
    userId: mongoose.Schema.Types.ObjectId, 
    text: String,
    createdAt: { type: Date, default: Date.now } 
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "NGO", required: true },
  volunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Applier" }], 
   notificationsSent: {
    type: [Date],
    default: []
  }
}, { timestamps: true }); // Added timestamps for created/updated at

module.exports = mongoose.model("Event", EventSchema);

