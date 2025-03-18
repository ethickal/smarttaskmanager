// client/src/pages/Dashboard.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TaskList from '../Tasks/TaskList';
import { useAuth } from '../Context/AuthContext';

const Dashboard = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <TaskList />
    </div>
  );
};

export default Dashboard;