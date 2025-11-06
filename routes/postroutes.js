import express from 'express';
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

// Create post
router.post('/', auth, async (req, res) => {
  const post = new Post({ author: req.userId, title: req.body.title, content: req.body.content });
  await post.save();
  res.json(post);
});

// Get all posts
router.get('/', async (req, res) => {
  const posts = await Post.find().populate('author', 'username').populate('comments');
  res.json(posts);
});

// Update post
router.put('/:id', auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post.author.toString() !== req.userId) return res.status(403).json({ error: "Unauthorized" });
  post.title = req.body.title;
  post.content = req.body.content;
  await post.save();
  res.json(post);
});

// Delete post
router.delete('/:id', auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post.author.toString() !== req.userId) return res.status(403).json({ error: "Unauthorized" });
  await post.delete();
  res.json({ message: "Post deleted" });
});

export default router;
