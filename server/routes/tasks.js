const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const User = require('../models/User');

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
    console.error('Error fetching tasks:', err.message);
    res.status(500).send('Server Error');
  }
});

// POST: Create a new task
router.post('/', auth, async (req, res) => {
  const { title, description, category, priority, dueDate } = req.body;

  // Basic validation
  if (!title || !dueDate) {
    return res.status(400).json({ msg: 'Title and due date are required' });
  }

  try {
    console.log('User ID:', req.user.id); // Debugging the user ID
    const newTask = new Task({
      user: req.user.id, // Assign the user ID from the decoded token
      title,
      description,
      category,
      priority,
      dueDate,
      sharedWith: [] // Initialize sharedWith as an empty array if not provided
    });

    const task = await newTask.save();
    res.status(201).json(task); // Status code 201 for resource creation
  } catch (err) {
    console.error('Error while saving task:', err.message);
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
    const isShared = task.sharedWith.some(u => u.toString() === req.user.id);

    if (!isOwner && !isShared) {
      return res.status(401).json({ msg: 'Not authorized to update this task' });
    }

    task = await Task.findByIdAndUpdate(id, { $set: taskFields }, { new: true });
    res.json(task);
  } catch (err) {
    console.error('Error updating task:', err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE: Remove a task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    const isOwner = task.user.toString() === req.user.id;
    const isShared = task.sharedWith.some(u => u.toString() === req.user.id);

    if (!isOwner && !isShared) {
      return res.status(401).json({ msg: 'Not authorized to delete this task' });
    }

    await task.remove();
    res.json({ msg: 'Task removed successfully' });
  } catch (err) {
    console.error('Error removing task:', err.message);
    res.status(500).send('Server Error');
  }
});

// POST: Share task with another user
router.post('/:id/share', auth, async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  // Validate email
  if (!email) {
    return res.status(400).json({ msg: 'Email is required to share a task' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to share this task' });
    }

    if (!task.sharedWith.some(u => u.toString() === user._id.toString())) {
      task.sharedWith.push(user._id);
      await task.save();
    }

    res.json(task);
  } catch (err) {
    console.error('Error sharing task:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
