// profileController.js
const mongoose = require("mongoose");
const User = require("../models/UserModel");

exports.getProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await User.findOne({ _id: userId }).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {

    const userId = req.params.userId;
    const updates = req.body;


    // Parse nested fields if they come as strings
    if (typeof updates.vehicleDetails === "string") {
      updates.vehicleDetails = JSON.parse(updates.vehicleDetails);
    }
    if (typeof updates.preferences === "string") {
      updates.preferences = JSON.parse(updates.preferences);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {

    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
};
