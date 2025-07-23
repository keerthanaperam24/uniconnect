const express = require('express');
const router = express.Router();
const authMiddleware = require('../authMiddleware');
const User = require('../models/User');

// GET /api/users
router.get('/', authMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('name email _id skills interests');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT /api/users/profile
router.put('/profile', authMiddleware, async (req, res) => {
  const { name, skills, interests } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, skills, interests },
      { new: true }
    );
    if (!user) return res.status(404).json({ msg: 'User not found' });
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, skills: user.skills, interests: user.interests } });
  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: 'Error updating profile' });
  }
});

// GET /api/users/:userId
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('name email skills interests');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;