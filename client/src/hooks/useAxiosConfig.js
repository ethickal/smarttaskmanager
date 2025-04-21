import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useMemo } from 'react';
import jwt_decode from 'jwt-decode';

const useAxiosConfig = () => {
  const { token } = useAuth();

  // Create memoized Axios instance based on the token
  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token || '',
      },
    });
    return instance;
  }, [token]);

  // Decode token and handle errors
  const decodedToken = useMemo(() => {
    if (token) {
      try {
        return jwt_decode(token);
      } catch (err) {
        console.error('Error decoding token:', err);
        return null;  // Return null if token is invalid
      }
    }
    return null; // Return null if no token is present
  }, [token]);

  return { axiosInstance, decodedToken };
};

export default useAxiosConfig;
