import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext'; // Import the custom AuthContext

const Login = () => {
  const { login } = useAuth(); // Access the login function from context
  const navigate = useNavigate(); // Navigate hook to redirect after successful login
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(''); // To store error message
  const [loading, setLoading] = useState(false); // To handle form submission loading state

  const { email, password } = formData; // Destructure form data for convenience

  // Handle changes in form inputs
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset any previous errors
    setLoading(true); // Set loading state

    // Basic validation for email format
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      setLoading(false);
      return;
    }

    // Ensure password is not empty
    if (password.trim() === '') {
      setError('Password cannot be empty');
      setLoading(false);
      return;
    }

    try {
      // Send POST request to the backend for login
      const res = await axios.post(
        'http://localhost:5000/api/users/login',
        { email, password }
      );

      // Log the token received from the server
      console.log('Token received from server:', res.data.token);

      // Save the token using context or other means and navigate to the dashboard
      login(res.data.token); // Store token in context or localStorage

      // Redirect to the dashboard page after successful login
      navigate('/dashboard');
    } catch (err) {
      // Handle error and provide the error message
      const errorMessage =
        err.response?.data?.msg || 'An error occurred during login';
      setError(errorMessage); // Display the error message to the user
      console.error('Login error:', err.response?.data); // Log the detailed error for debugging
    } finally {
      setLoading(false); // Reset loading state once the request is complete
    }
  };

  return (
    <div className="auth-container">
      <h1>Login</h1>
      {/* Display error message if any */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Login form */}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
            placeholder="Enter your email"
            disabled={loading} // Disable input while loading
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
            placeholder="Enter your password"
            disabled={loading} // Disable input while loading
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
