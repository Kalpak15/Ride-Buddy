const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
});

const PostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true, trim: true, maxlength: 500 },
  category: {
    type: String,
    enum: ["Thought", "Traffic Update", "Ride Experience", "Weather", "Route Share"],
    required: true,
  },
  reactions: {
    like: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislike: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  comments: [CommentSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", PostSchema);