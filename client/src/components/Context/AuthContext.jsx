// client/src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set axios default base URL
  axios.defaults.baseURL = 'http://localhost:5000';

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`
            }
          };
          console.log('Token:', token); // Log the token
          const res = await axios.get('/api/users/auth', config); // Fetch user data
          console.log('Response from server:', res.data); // Log the response


          setUser(res.data); // Set user data

        } catch (err) {
          console.error('Error loading user:', err);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = (token) => {
    console.log('Storing token in local storage:', token);
    localStorage.setItem('token', token);
    console.log('Token stored in local storage:', token); // Log the token


    setToken(token);
  };

  const logout = () => {
    console.log('Removing token from local storage');
    localStorage.removeItem('token');

    setToken(null);
    setUser(null);
  };

  const value = {
    token,
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!token
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
