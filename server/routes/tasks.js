// server/routes/tasks.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const User = require('../models/User'); // ⬅️ FIX: This was missing

// GET: All tasks for the authenticated user
router.get('/', auth, async (req, res) => {
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

// POST: Create a new task
router.post('/', auth, async (req, res) => {
  const { title, description, category, priority, dueDate } = req.body;

  try {
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

// PUT: Update a task
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { title, description, category, priority, dueDate, completed } = req.body;

  const taskFields = {};
  if (title !== undefined) taskFields.title = title;
  if (description !== undefined) taskFields.description = description;
  if (category !== undefined) taskFields.category = category;
  if (priority !== undefined) taskFields.priority = priority;
  if (dueDate !== undefined) taskFields.dueDate = dueDate;
  if (completed !== undefined) taskFields.completed = completed;

  try {
    let task = await Task.findById(id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    const isOwner = task.user.toString() === req.user.id;
    const isShared = task.sharedWith.map(u => u.toString()).includes(req.user.id);

    if (!isOwner && !isShared) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    task = await Task.findByIdAndUpdate(id, { $set: taskFields }, { new: true });
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE: Remove a task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await task.remove();
    res.json({ msg: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST: Share task with another user
router.post('/:id/share', auth, async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    if (!task.sharedWith.map(u => u.toString()).includes(user._id.toString())) {
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
