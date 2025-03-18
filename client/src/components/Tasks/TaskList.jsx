// client/src/components/Tasks/TaskList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import { useAuth } from '../Context/AuthContext';

const TaskList = () => {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
          const token = localStorage.getItem('token'); // Get token from storage
          const response = await axios.get('http://localhost:5000/api/tasks', {
              headers: {
                  Authorization: `Bearer ${token}`
              }
          });
          console.log(response.data);
      } catch (error) {
          console.error("Error fetching tasks:", error.response?.data || error.message);
      }
  };
  
    fetchTasks();
  }, [token]);

  // Add task
  const addTask = task => {
    setTasks([task, ...tasks]);
  };

  // Update task
  const updateTask = updatedTask => {
    setTasks(tasks.map(task => task._id === updatedTask._id ? updatedTask : task));
  };

  // Delete task
  const deleteTask = id => {
    setTasks(tasks.filter(task => task._id !== id));
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'active') return !task.completed;
    return true;
  }).filter(task => {
    if (categoryFilter === 'all') return true;
    return task.category === categoryFilter;
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div className="task-list-container">
      <TaskForm addTask={addTask} />
      <div className="task-filters">
        <div className="filter-group">
          <button 
            className={filter === 'all' ? 'active' : ''} 
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={filter === 'active' ? 'active' : ''} 
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button 
            className={filter === 'completed' ? 'active' : ''} 
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
        <div className="category-filter">
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="Personal">Personal</option>
            <option value="Work">Work</option>
            <option value="School">School</option>
            <option value="Health">Health</option>
          </select>
        </div>
      </div>
      <div className="tasks">
      {(!filteredTasks || filteredTasks.length === 0) ? (

          <p>No tasks found.</p>
        ) : (
          filteredTasks.map(task => (
            <TaskItem 
              key={task._id} 
              task={task} 
              updateTask={updateTask} 
              deleteTask={deleteTask} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;
