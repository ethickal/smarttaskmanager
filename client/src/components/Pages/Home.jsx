import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="home-container">
      <div className="hero">
        <h1>SMART TASK MANAGER</h1>
        <p>Enhance your productivity with our efficient and user-friendly task management platform.</p>
        {!isAuthenticated ? (
          <div className="auth-buttons">
            <Link to="/login" className="btn btn-primary" aria-label="Go to login page">Login</Link>
            <Link to="/register" className="btn btn-secondary" aria-label="Go to register page">Register</Link>
          </div>
        ) : (
          <Link to="/dashboard" className="btn btn-primary" aria-label="Go to dashboard">Go to Dashboard</Link>
        )}
      </div>
      
      <div className="features">
        <h2>Features</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Task Management</h3>
            <p>Create, edit, and delete tasks with just a few clicks.</p>
          </div>
          <div className="feature-card">
            <h3>Priority Levels</h3>
            <p>Assign high, medium, or low priority to tasks for better organization.</p>
          </div>
          <div className="feature-card">
            <h3>Due Dates & Reminders</h3>
            <p>Set deadlines and get reminders to ensure timely task completion.</p>
          </div>
          <div className="feature-card">
            <h3>Task Sharing</h3>
            <p>Collaborate with team members by sharing tasks.</p>
          </div>
        </div>
      </div>
      
      <div className="sdg-section">
        <h2>Supporting Sustainable Development Goals</h2>
        <div className="sdg-cards">
          <div className="sdg-card">
            <h3>SDG 4: Quality Education</h3>
            <p>Assist students in tracking academic tasks and deadlines.</p>
          </div>
          <div className="sdg-card">
            <h3>SDG 3: Good Health and Well-Being</h3>
            <p>Reduce stress by improving time management and organization.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
