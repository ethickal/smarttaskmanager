// client/src/components/Tasks/TaskForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const TaskForm = ({ addTask }) => {
  const { token } = useAuth();
  const [task, setTask] = useState({
    title: '',
    description: '',
    category: 'Personal',
    priority: 'medium',
    dueDate: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state for button

  const { title, description, category, priority, dueDate } = task;

  const onChange = e => setTask({ ...task, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setError(''); // Reset error message before submitting
    setLoading(true); // Start loading state

    // Validation
    if (title === '') {
      setError('Please add a title');
      setLoading(false);
      return;
    }

    if (!dueDate) {
      setError('Please select a due date');
      setLoading(false);
      return;
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      }
    };

    try {
      const res = await axios.post('/api/tasks', task, config);
      addTask(res.data);
      setTask({
        title: '',
        description: '',
        category: 'Personal',
        priority: 'medium',
        dueDate: ''
      });
      setLoading(false);
    } catch (err) {
      setError('Error adding task, please try again later.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="task-form">
      <h2>Add Task</h2>
      {error && <div className="alert alert-danger">{error}</div>} {/* Error message display */}
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          value={title}
          onChange={onChange}
          placeholder="Task title"
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          value={description}
          onChange={onChange}
          placeholder="Task description"
        ></textarea>
      </div>
      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select name="category" value={category} onChange={onChange}>
          <option value="Personal">Personal</option>
          <option value="Work">Work</option>
          <option value="School">School</option>
          <option value="Health">Health</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="priority">Priority</label>
        <select name="priority" value={priority} onChange={onChange}>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="dueDate">Due Date</label>
        <input
          type="datetime-local"
          name="dueDate"
          value={dueDate}
          onChange={onChange}
        />
      </div>
      <button type="submit" className="btn" disabled={loading}>
        {loading ? 'Adding...' : 'Add Task'}
      </button>
    </form>
  );
};

export default TaskForm;
