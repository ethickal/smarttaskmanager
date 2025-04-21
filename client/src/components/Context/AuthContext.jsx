import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Update the baseURL to the correct port
  axios.defaults.baseURL = 'http://localhost:5173'; // Updated port

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`, // Sending the token in the Authorization header
            },
          };

          // Use the relative URL with the updated baseURL
          const res = await axios.get('/api/auth', config);
          console.log('Response from server:', res.data);
          setUser(res.data);
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

  const login = (newToken) => {
    console.log('Storing token in local storage:', newToken);
    localStorage.setItem('token', newToken);
    setToken(newToken); // Set new token in state
  };

  const logout = () => {
    console.log('Removing token from local storage');
    localStorage.removeItem('token');
    setToken(null);
    setUser(null); // Clear user data
  };

  const value = {
    token,
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!token, // Check if the user is authenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

