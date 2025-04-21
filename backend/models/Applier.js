const mongoose = require("mongoose");

const applierSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sex: { type: String, required: true },
    skills: { type: String, required: true },
    age: { type: Number, required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    eventCreatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },  // This field is required
});
module.exports = mongoose.model("Applier", applierSchema);