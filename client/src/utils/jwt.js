import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useMemo, useEffect, useState } from 'react';
import { default as jwt_decode } from 'jwt-decode'; // ✅ Correct way to import with Vite

const useAxiosConfig = () => {
  const { token } = useAuth();
  const [decodedToken, setDecodedToken] = useState(null);

  // Create a memoized axios instance with the current token
  const axiosInstance = useMemo(() => {
    return axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token || '',
      },
    });
  }, [token]);

  // Decode JWT whenever token changes
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setDecodedToken(decoded);
      } catch (err) {
        console.error('Invalid token:', err);
        setDecodedToken(null);
      }
    } else {
      setDecodedToken(null);
    }
  }, [token]);

  return { axiosInstance, decodedToken };
};

export default useAxiosConfig;
