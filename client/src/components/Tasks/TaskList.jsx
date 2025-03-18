// client/src/components/Tasks/TaskList.js
import React, { useState, useEffect, useCallback } from 'react';
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

  // Fetch tasks from the API
  const fetchTasks = useCallback(async () => {
    const token = localStorage.getItem("token");
    console.log("Token before fetching tasks:", token); // Debugging log
  
    if (!token) {
      console.error("No token found. Please log in.");
      setLoading(false);
      return;
    }
  
    try {
      const response = await axios.get("http://localhost:5000/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      console.log("Tasks fetched successfully:", response.data);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }, [token]); // Only re-run when `token` changes

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]); // Only re-run if `fetchTasks` changes

  // Add task
  const addTask = task => {
    setTasks(prevTasks => [task, ...prevTasks]);
  };

  // Update task
  const updateTask = updatedTask => {
    setTasks(prevTasks =>
      prevTasks.map(task => task._id === updatedTask._id ? updatedTask : task)
    );
  };

  // Delete task
  const deleteTask = id => {
    setTasks(prevTasks => prevTasks.filter(task => task._id !== id));
  };

  // Filter tasks
  const filteredTasks = tasks
    .filter(task => (filter === 'completed' ? task.completed : filter === 'active' ? !task.completed : true))
    .filter(task => (categoryFilter === 'all' ? true : task.category === categoryFilter));

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
