const mongoose = require("mongoose");

const applierSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  sex: { type: String, required: true },
  skills: { type: String, required: true },
  age: { type: Number, required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  eventCreatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'NGO', required: true },
  receiveNotifications: {
    type: Boolean,
    default: true
  } // <-- FIXED
}, { timestamps: true });

module.exports = mongoose.model("Applier", applierSchema);