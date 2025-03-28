// RideModel.js
const mongoose = require('mongoose');

const RideSchema = new mongoose.Schema({
    start: {
        type: String,
        required: true,
        trim: true,
    },
    stops: [{
        type: String,
        trim: true
    }], // Added array of stops
    destination: {
        type: String,
        required: true,
        trim: true,
    },
    time: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    seats: {
        type: Number,
        required: true,
        min: 0,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    }, // Added price field
    driver: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model("Ride", RideSchema);