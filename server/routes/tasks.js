// server/routes/tasks.js
const express = require('express');
const router = express.Router();
const verifyToken = require("../middleware/auth");
const Task = require('../models/Task');


router.get("/", verifyToken, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ msg: 'User not authenticated' });
    }
    const tasks = await Task.find({ user: req.user.id });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Get all tasks for the authenticated user
router.get('/', async (req, res) => {

  if (!req.user || !req.user.id) {
    return res.status(401).json({ msg: 'User not authenticated' });
  }

  try {
    const tasks = await Task.find({ 
      $or: [
        { user: req.user.id },
        { sharedWith: req.user.id }
      ]
    }).sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add a new task
router.post('/', async (req, res) => {

  const { title, description, category, priority, dueDate } = req.body;

  try {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ msg: 'User not authenticated' });
    }
    const newTask = new Task({
      user: req.user.id,

      title,
      description,
      category,
      priority,
      dueDate
    });

    const task = await newTask.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update a task
router.put('/:id', async (req, res) => {

  const { title, description, category, priority, dueDate, completed } = req.body;

  // Build task object
  const taskFields = {};
  if (title !== undefined) taskFields.title = title;
  if (description !== undefined) taskFields.description = description;
  if (category !== undefined) taskFields.category = category;
  if (priority !== undefined) taskFields.priority = priority;
  if (dueDate !== undefined) taskFields.dueDate = dueDate;
  if (completed !== undefined) taskFields.completed = completed;

  try {
    let task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ msg: 'Task not found' });

    // Make sure user owns task or is shared with user
    if (task.user.toString() !== req.user.id && 
        !task.sharedWith.includes(req.user.id)) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: taskFields },
      { new: true }
    );

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {

  try {
    let task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ msg: 'Task not found' });

    // Make sure user owns task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Task.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Share a task with another user
router.post('/:id/share', async (req, res) => {

  try {
    const { email } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }
    
    // Check if task belongs to current user
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    // Add user to sharedWith array if not already there
    if (!task.sharedWith.includes(user._id)) {
      task.sharedWith.push(user._id);
      await task.save();
    }
    
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
