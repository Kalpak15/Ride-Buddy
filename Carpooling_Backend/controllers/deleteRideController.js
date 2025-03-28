const mongoose = require("mongoose");
const Ride = require("../models/RideModel");
const PassengerRide = require("../models/PassengerRideModel");
const User = require("../models/UserModel");
const transporter = require("../utils/nodemailer");
const { createNotification } = require("./notificationController");

exports.deleteRide = async (req, res) => {
  try {
    const { rideId } = req.params;
    const userId = req.userInfo.userId;
    const { reason } = req.body;

    console.log(`Attempting to delete ride ${rideId} by user ${userId} with reason: ${reason}`);

    if (!mongoose.Types.ObjectId.isValid(rideId)) {
      return res.status(400).json({ message: "Invalid ride ID" });
    }

    if (!reason) {
      return res.status(400).json({ message: "Cancellation reason is required" });
    }

    // Fetch ride with populated driver
    const ride = await Ride.findById(rideId).populate("driver");
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    // Log ride and driver details for debugging
    // console.log("Ride:", JSON.stringify(ride, null, 2));
    // console.log("Driver:", JSON.stringify(ride.driver, null, 2));

    // Ensure driver is populated and matches userId
    if (!ride.driver || ride.driver._id.toString() !== userId) {
      return res.status(403).json({ message: "You can only delete your own rides" });
    }

    // Check for booked passengers
    const passengerRides = await PassengerRide.find({ ride: rideId }).populate("passenger");
    if (passengerRides.length > 0) {
      for (const passengerRide of passengerRides) {
        const passenger = passengerRide.passenger;

        // Use driver details from populated ride.driver
        const driverEmail = ride.driver.email || "N/A";
        const driverPhone = ride.driver.phoneNumber || "N/A";

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: passenger.email,
          subject: "Ride Cancellation Notice",
          html: `
            <h2>Ride Cancelled</h2>
            <p>We’re sorry for the inconvenience, but your ride from <strong>${ride.start}</strong> to <strong>${ride.destination}</strong> on <strong>${ride.date} at ${ride.time}</strong> has been cancelled by the driver.</p>
            <p><strong>Reason:</strong> ${reason}</p>
            <p>Please contact the driver at <strong>${driverPhone}</strong> or <strong>${driverEmail}</strong> for further details or to arrange an alternative.</p>
            <p>We apologize for any disruption this may cause.</p>
          `,
        };
        await transporter.sendMail(mailOptions);

        await createNotification(
          passenger._id,
          `We’re sorry for the inconvenience, but your ride from ${ride.start} to ${ride.destination} on ${ride.date} at ${ride.time} has been cancelled by the driver.`,
          "ride_cancelled",
          false
        );
      }
    }

    // Delete the ride
    await Ride.findByIdAndDelete(rideId);

    // Notify driver of successful cancellation
    await createNotification(
      userId,
      `Your ride from ${ride.start} to ${ride.destination} on ${ride.date} at ${ride.time} has been cancelled successfully. Reason: ${reason}`,
      "ride_cancelled",
      false
    );

    res.status(200).json({
      success: true,
      message: "Ride deleted successfully",
      hasPassengers: passengerRides.length > 0,
    });
  } catch (error) {
    console.error("Error deleting ride:", error.stack);
    res.status(500).json({
      success: false,
      message: "Failed to delete ride",
      error: error.message,
    });
  }
};