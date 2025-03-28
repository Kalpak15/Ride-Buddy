const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const upload = require("../utils/multer");
const User = require("../models/UserModel");


const { getProfile ,updateProfile} = require("../controllers/profileController");


router.put("/upload-profile-picture/:userId", upload.single("profilePicture"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
  
      const imageUrl = `/uploads/${req.file.filename}`; // Path to access uploaded image
  
      // Update user profile picture in the database
      const updatedUser = await User.findByIdAndUpdate(req.params.userId, { profilePicture: imageUrl }, { new: true });
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ message: "Profile picture updated", user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: "Error updating profile", error: error.message });
    }
  });
  

// Route to fetch profile data 
router.get("/get-profile/:userId", authMiddleware, getProfile);
router.put("/edit-profile/:userId", authMiddleware, updateProfile);




module.exports = router;
