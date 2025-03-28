// PassengerRideModel.js
const mongoose = require("mongoose");

const PassengerRideSchema = new mongoose.Schema({
  start: {
    type: String,
    required: true,
    trim: true,
  },
  destination: {
    type: String,
    required: true,
    trim: true,
  },
  time: {
    type: String,
    required: true,
  },
  seats: {
    type: Number,
    required: true,
    min: 1,
  },
  ride: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ride",
    required: true,
  },
  passenger: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // Add this to track the passenger
  },
  status: {
    type: String,
    enum: ["upcoming", "completed", "cancelled"],
    default: "upcoming", // Add status field for frontend filtering
  },
}, { timestamps: true });

module.exports = mongoose.model("PassengerRide", PassengerRideSchema);