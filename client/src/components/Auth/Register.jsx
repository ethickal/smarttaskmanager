// client/src/components/Auth/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });
  const [error, setError] = useState('');

  const { name, email, password, password2 } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    
    if (password !== password2) {
      setError('Passwords do not match');
    } else {
      try {
        const res = await axios.post('/api/users/register', {
          name,
          email,
          password
        });
        login(res.data.token);
        navigate('/dashboard');
      } catch (err) {
        setError(err.response?.data?.msg || 'An error occurred');
      }
    }
  };

  return (
    <div className="auth-container">
      <h1>Register</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={onChange}
            required
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
                 minLength="6"
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
                 minLength="6"
               />
             </div>
             <button type="submit" className="btn btn-primary">Register</button>
           </form>
         </div>
       );
     };
     
     export default Register;