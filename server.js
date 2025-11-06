import express from 'express';
import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

// Auth middleware
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Add comment
router.post('/:postId', auth, async (req, res) => {
  const comment = new Comment({ author: req.userId, post: req.params.postId, content: req.body.content });
  await comment.save();
  const post = await Post.findById(req.params.postId);
  post.comments.push(comment._id);
  await post.save();
  res.json(comment);
});

export default router;
