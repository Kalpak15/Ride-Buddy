const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const Review = require('../models/ReviewModel');

// Create a review
router.post('/post-review', authMiddleware, async (req, res) => {
  try {
    const { title, content, rating, user_id } = req.body;
    const numericRating = Number(rating);
    
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: "Invalid rating. Rating should be a number between 1 and 5." });
    }
    const newReview = new Review({
      user_id,
      title,
      content,
      rating:numericRating,
    });
    await newReview.save();
    res.status(201).json({ message: "Review posted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all reviews
router.get('/get-reviews', authMiddleware, async (req, res) => {
  try {
    const reviews = await Review.find().populate('user_id', 'email');
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
