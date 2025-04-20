// client/src/components/Layout/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate for navigation
import { useAuth } from '../Context/AuthContext'; // Import the custom authentication context

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth(); // Destructure authentication state from context
  const navigate = useNavigate(); // useNavigate hook for redirecting after logout

  // Logout handler function
  const onLogout = () => {
    logout(); // Call the logout function from the AuthContext
    navigate('/'); // Redirect to home page after logging out
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo and Home link */}
        <Link to="/" className="navbar-logo">
          SMART TASK MANAGER
        </Link>
        
        {/* Navigation menu */}
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>

          {/* If the user is authenticated, show Dashboard and Logout options */}
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
              </li>
              {/* Show a logout link */}
              <li className="nav-item">
                <a href="#!" onClick={onLogout} className="nav-link">
                  Logout
                </a>
              </li>
              {/* Optionally display the user's name if they are authenticated */}
              {user && (
                <li className="nav-item">
                  <span className="nav-link">Welcome, {user.name}</span>
                </li>
              )}
            </>
          ) : (
            // If the user is not authenticated, show Login and Register options
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">Login</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
