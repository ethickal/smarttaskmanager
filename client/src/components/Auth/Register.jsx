// client/src/components/Auth/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';

const Register = () => {
  const { login } = useAuth(); // Access the login function from context
  const navigate = useNavigate(); // Navigate hook to redirect after successful registration
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });
  const [error, setError] = useState(''); // To store error message

  const { name, email, password, password2 } = formData; // Destructure form data for convenience

  // Handle changes in form inputs
  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle form submission
  const onSubmit = async e => {
    e.preventDefault();
    setError(''); // Reset any previous errors
    
    // Check if passwords match
    if (password !== password2) {
      setError('Passwords do not match');
    } else {
      try {
        // Send POST request to the correct backend route for registration
        const res = await axios.post('http://localhost:5000/api/auth/register', {
          name,
          email,
          password
        });

        // Log the token received from the server and save it
        console.log('Token received from server:', res.data.token);
        
        // Use context to save the token and login the user
        login(res.data.token);

        // Redirect to the dashboard after successful registration
        navigate('/dashboard');
      } catch (err) {
        // Set error message from response or fallback to a default message
        setError(err.response?.data?.msg || 'An error occurred');
      }
    }
  };

  return (
    <div className="auth-container">
      <h1>Register</h1>
      {/* Display error message if any */}
      {error && <div className="alert alert-danger">{error}</div>}
      
      {/* Registration form */}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={onChange}
            required
            placeholder="Enter your name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
            placeholder="Enter your email"
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
            minLength="6" // Password must be at least 6 characters
            placeholder="Enter your password"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password2">Confirm Password</label>
          <input
            type="password"
            name="password2"
            value={password2}
            onChange={onChange}
            required
            minLength="6" // Password confirmation must be at least 6 characters
            placeholder="Confirm your password"
          />
        </div>
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
    </div>
  );
};

export default Register;
