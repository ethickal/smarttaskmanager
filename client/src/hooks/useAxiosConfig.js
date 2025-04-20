import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useMemo } from 'react';
import jwt_decode from 'jwt-decode';

const useAxiosConfig = () => {
  const { token } = useAuth();

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

  return { axiosInstance, decodedToken: token ? jwt_decode(token) : null };
};

export default useAxiosConfig;
