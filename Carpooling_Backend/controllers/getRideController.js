// getRideController.js
const Ride = require("../models/RideModel");
const PassengerRide = require("../models/PassengerRideModel");



// Controller to get all rides
exports.getRides = async (req, res) => {
  try {
    // Fetch all rides and populate the driver field with firstName, lastName, and profilePicture
    const rides = await Ride.find().populate("driver", "firstName lastName profilePicture");

    // Check if rides exist
    if (!rides || rides.length === 0) {
      return res.status(404).json({ message: "No rides available" });
    }

    //filter the rides if 0 seats then dont add them
    const availableRides = rides.filter((ride) => ride.seats > 0);

    // Send success response with populated rides data
    res.status(200).json({
      message: "Rides fetched successfully",
      rides: availableRides,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch rides",
      error: err.message,
    });
  }
};

// ... other controllers remain unchanged


// Controller to get details of a specific ride by ID
exports.getRide = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch ride by ID from the database
        const ride = await Ride.findById(id);

        // Check if ride exists
        if (!ride) {
            return res.status(404).json({ message: "Ride not found" });
        }

        // Send success response with ride data
        res.status(200).json({
            message: "Ride fetched successfully",
            ride: ride,
        });
    } catch (err) {
        console.error(err);

        // Handle invalid IDs and other errors
        if (err.kind === "ObjectId") {
            return res.status(400).json({ message: "Invalid ride ID" });
        }

        // Send error response
        res.status(500).json({
            message: "Failed to fetch ride details",
            error: err.message,
        });
    }
};


// Controller to get details of a specific ride by ID
exports.getRidesByDriverId = async (req, res) => {
    try {
        const { driver } = req.params;

        // Fetch ride by ID from the database
        const rides = await Ride.find({driver});

        // Check if ride exists
        if (!rides) {
            return res.status(404).json({ message: "Rides of user not found" });
        }

        // Send success response with ride data
        res.status(200).json({
            message: "Rides fetched successfully",
            rides: rides,
        });
    } catch (err) {
        console.error(err);

        // Handle invalid IDs and other errors
        if (err.kind === "ObjectId") {
            return res.status(400).json({ message: "Invalid ride ID" });
        }

        // Send error response
        res.status(500).json({
            message: "Failed to fetch ride details of user",
            error: err.message,
        });
    }
};

// Controller to get details of a specific ride by ID   
// getRideController.js
exports.getPassengerRidesByPassengerId = async (req, res) => {
  try {
    const { passenger } = req.params; // Change 'driver' to 'passenger'

    // Fetch passenger rides and populate the ride's driver details
    const rides = await PassengerRide.find({ passenger })
      .populate({
        path: "ride",
        populate: {
          path: "driver",
          select: "name photo", // Assuming User model has these fields
        },
      });

    if (!rides || rides.length === 0) {
      return res.status(404).json({ message: "No rides found for this passenger" });
    }

    res.status(200).json({
      message: "Passenger rides fetched successfully",
      rides: rides,
    });
  } catch (err) {
    console.error(err);
    if (err.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid passenger ID" });
    }
    res.status(500).json({
      message: "Failed to fetch passenger ride details",
      error: err.message,
    });
  }
};