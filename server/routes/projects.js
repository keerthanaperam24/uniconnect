const express = require('express');
const router = express.Router();
const authMiddleware = require('../authMiddleware');
const Project = require('../models/Project');

// GET /api/projects
router.get('/', authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find().populate('userId', 'name').sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /api/projects
router.post('/', authMiddleware, async (req, res) => {
  const { title, description } = req.body;
  try {
    if (!title) {
      return res.status(400).json({ msg: 'Title is required' });
    }
    const project = new Project({
      userId: req.user.id,
      title,
      description,
    });
    await project.save();
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: 'Error creating project' });
  }
});

module.exports = router;