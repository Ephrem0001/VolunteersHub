const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  skills: {
    type: String,
    required: true,
  },
  interests: {
    type: String,
    required: true,
  },
  hasExperience: {
    type: Boolean,
    required: true,
  },
});
module.exports = mongoose.model("Profile", profileSchema);