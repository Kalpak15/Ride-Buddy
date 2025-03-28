const express = require("express");
const router = express.Router();
const {
  createPost,
  getPosts,
  addReaction,
  addComment,
  deletePost,
  deleteComment,
} = require("../controllers/postController");
const authMiddleware  = require("../middlewares/auth-middleware");

router.post("/posts", authMiddleware, createPost);
router.get("/posts", authMiddleware, getPosts);
router.post("/posts/react", authMiddleware, addReaction);
router.post("/posts/comment", authMiddleware, addComment);
router.delete("/posts/:postId", authMiddleware, deletePost);
router.delete("/posts/:postId/comments/:commentId", authMiddleware, deleteComment);

module.exports = router;