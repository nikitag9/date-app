import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcodeVerified, setPasscodeVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  // Set up axios defaults
  axios.defaults.baseURL = 'http://localhost:5001/api';

  useEffect(() => {
    // Check for existing user session
    const savedUser = localStorage.getItem('user');
    const savedPasscodeVerified = localStorage.getItem('passcodeVerified');
    
    if (savedUser && savedPasscodeVerified === 'true') {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
      setPasscodeVerified(true);
    }
    
    setLoading(false);
  }, []);

  const login = async (userData) => {
    try {
      // Store user data
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('passcodeVerified', 'true');
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed' };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setPasscodeVerified(false);
    localStorage.removeItem('user');
    localStorage.removeItem('passcodeVerified');
  };

  const value = {
    user,
    isAuthenticated,
    passcodeVerified,
    setPasscodeVerified,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 