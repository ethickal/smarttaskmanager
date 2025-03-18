// client/src/components/Tasks/TaskItem.js
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';

const TaskItem = ({ task, updateTask, deleteTask }) => {
  const { token } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editTask, setEditTask] = useState(task);

  if (!task) {
    return <p>Task not available.</p>;
  }
  
  const { _id, title, description, category, priority, dueDate, completed } = task;


  const onChange = e => setEditTask({ ...editTask, [e.target.name]: e.target.value });

  const onToggleComplete = async () => {
    const updatedTask = { ...task, completed: !completed };
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      }
    };

    try {
      const res = await axios.put(`/api/tasks/${_id}`, updatedTask, config);
      updateTask(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const onDelete = async () => {
    const config = {
      headers: {
        'x-auth-token': token
      }
    };

    try {
      await axios.delete(`/api/tasks/${_id}`, config);
      deleteTask(_id);
    } catch (err) {
      console.error(err);
    }
  };

  const onSubmitEdit = async e => {
    e.preventDefault();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      }
    };

    try {
      const res = await axios.put(`/api/tasks/${_id}`, editTask, config);
      updateTask(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Format due date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const priorityColor = {
    high: 'red',
    medium: 'orange',
    low: 'green'
  };

  return (
    <div className={`task-item ${completed ? 'completed' : ''}`}>
      {isEditing ? (
        <form onSubmit={onSubmitEdit} className="edit-form">
          <input
            type="text"
            name="title"
            value={editTask.title}
            onChange={onChange}
            required
          />
          <textarea
            name="description"
            value={editTask.description}
            onChange={onChange}
          ></textarea>
          <select name="category" value={editTask.category} onChange={onChange}>
            <option value="Personal">Personal</option>
            <option value="Work">Work</option>
            <option value="School">School</option>
            <option value="Health">Health</option>
          </select>
          <select name="priority" value={editTask.priority} onChange={onChange}>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <input
            type="datetime-local"
            name="dueDate"
            value={editTask.dueDate ? editTask.dueDate.substring(0, 16) : ''}
            onChange={onChange}
          />
          <div className="form-actions">
            <button type="submit" className="btn">Save</button>
            <button type="button" onClick={() => setIsEditing(false)} className="btn">Cancel</button>
          </div>
        </form>
      ) : (
        <>
          <div className="task-header">
            <h3>
              <span className="checkbox" onClick={onToggleComplete}>
                {completed ? '✓' : '◯'}
              </span>
              <span className={completed ? 'task-completed' : ''}>{title}</span>
            </h3>
            <div className="task-controls">
              <button onClick={() => setIsEditing(true)} className="btn-edit">Edit</button>
              <button onClick={onDelete} className="btn-delete">Delete</button>
            </div>
          </div>
          {description && <p className="task-description">{description}</p>}
          <div className="task-meta">
            <span className="task-category">{category}</span>
            <span className="task-priority" style={{ color: priorityColor[priority] }}>
              {priority}
            </span>
            {dueDate && <span className="task-due-date">Due: {formatDate(dueDate)}</span>}
          </div>
        </>
      )}
    </div>
  );
};

export default TaskItem;
