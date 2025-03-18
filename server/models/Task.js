const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  category: {
    type: String,
    default: 'Personal',
    enum: ['Work', 'Personal', 'School']
  },
  priority: {
    type: String,
    default: 'Medium',
    enum: ['High', 'Medium', 'Low']
  },
  dueDate: {
    type: Date
  },
  reminder: {
    type: Date
  },
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'In Progress', 'Completed']
  },
  sharedWith: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('task', TaskSchema);