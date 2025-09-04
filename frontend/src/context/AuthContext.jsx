import React from 'react';
import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  
  // Set up axios defaults
  axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  
  // Check if user is logged in on initial load
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setIsLoading(false);
          return;
        }
        
        // Set auth header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Get user data
        const res = await axios.get('/auth/me');
        
        if (res.data.success) {
          setUser(res.data.data);
          setIsAuthenticated(true);
        }
      } catch (error) {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setError(error.response?.data?.message || 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUserLoggedIn();
  }, []);
  
  // Register user
  const register = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const res = await axios.post('/auth/register', userData);
      
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        setUser(res.data.user);
        setIsAuthenticated(true);
        navigate('/');
        return { success: true };
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Login user
  const login = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const res = await axios.post('/auth/login', userData);
      
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        setUser(res.data.user);
        setIsAuthenticated(true);
        navigate('/');
        return { success: true };
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };
  
  // Update user data (e.g., wallet balance)
  const updateUserData = async () => {
    try {
      const res = await axios.get('/auth/me');
      
      if (res.data.success) {
        setUser(res.data.data);
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        register,
        login,
        logout,
        updateUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;