const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  image: { type: String, required: false }, // Store image URL
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }, // New status field
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [{ userId: mongoose.Schema.Types.ObjectId, text: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "NGO", required: true },
  volunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Applier", default: [] }], 
});

module.exports = mongoose.model("Event", EventSchema);

