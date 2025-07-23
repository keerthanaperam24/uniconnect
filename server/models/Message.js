const express = require('express');
const router = express.Router();
const authMiddleware = require('../authMiddleware');
const Post = require('../models/Post');

// GET /api/posts
router.get('/', authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find().populate('userId', 'name').sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /api/posts
router.post('/', authMiddleware, async (req, res) => {
  const { type, title, description, price } = req.body;
  try {
    if (!type || !title) {
      return res.status(400).json({ msg: 'Type and title are required' });
    }
    const post = new Post({
      userId: req.user.id,
      type,
      title,
      description,
      price,
    });
    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: 'Error creating post' });
  }
});

module.exports = router;