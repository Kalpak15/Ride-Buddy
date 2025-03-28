const Post = require("../models/PostModel");

exports.createPost = async (req, res) => {
  try {
    const { content, category } = req.body;
    const userId = req.userInfo.userId;

    if (!content || !category) {
      return res.status(400).json({ message: "Content and category are required" });
    }

    const post = new Post({
      user: userId,
      content,
      category,
      reactions: { like: [], dislike: [] },
    });

    const savedPost = await post.save();
    const populatedPost = await Post.findById(savedPost._id).populate(
      "user",
      "firstName lastName profilePicture"
    );

    res.status(201).json({ message: "Post created successfully", post: populatedPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Failed to create post", error: error.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "firstName lastName profilePicture")
      .populate("comments.user", "firstName lastName profilePicture")
      .sort({ createdAt: -1 });
    res.status(200).json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Failed to fetch posts", error: error.message });
  }
};

exports.addReaction = async (req, res) => {
  try {
    const { postId, reactionType } = req.body;
    const userId = req.userInfo.userId;

    const allowedReactions = ["like", "dislike"];
    if (!allowedReactions.includes(reactionType)) {
      return res.status(400).json({ message: "Invalid reaction type" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const reactionArray = post.reactions[reactionType];
    const hasReacted = reactionArray.includes(userId);

    if (hasReacted) {
      post.reactions[reactionType] = reactionArray.filter(
        (id) => id.toString() !== userId
      );
    } else {
      post.reactions[reactionType].push(userId);
    }

    await post.save();
    const updatedPost = await Post.findById(postId)
      .populate("user", "firstName lastName profilePicture")
      .populate("comments.user", "firstName lastName profilePicture");

    res.status(200).json({ message: "Reaction updated", post: updatedPost });
  } catch (error) {
    console.error("Error adding reaction:", error);
    res.status(500).json({ message: "Failed to add reaction", error: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { postId, content } = req.body;
    const userId = req.userInfo.userId;

    if (!content) {
      return res.status(400).json({ message: "Comment content is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({ user: userId, content });
    await post.save();

    const updatedPost = await Post.findById(postId)
      .populate("user", "firstName lastName profilePicture")
      .populate("comments.user", "firstName lastName profilePicture");

    res.status(201).json({ message: "Comment added successfully", post: updatedPost });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Failed to add comment", error: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.userInfo.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user.toString() !== userId) {
      return res.status(403).json({ message: "You can only delete your own posts" });
    }

    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Failed to delete post", error: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.userInfo.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user.toString() !== userId) {
      return res.status(403).json({ message: "You can only delete your own comments" });
    }

    post.comments = post.comments.filter((c) => c._id.toString() !== commentId);
    await post.save();

    const updatedPost = await Post.findById(postId)
      .populate("user", "firstName lastName profilePicture")
      .populate("comments.user", "firstName lastName profilePicture");

    res.status(200).json({ message: "Comment deleted successfully", post: updatedPost });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Failed to delete comment", error: error.message });
  }
};