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

// Set the base URL for all API calls
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
axios.defaults.baseURL = `${API_URL}/api`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcodeVerified, setPasscodeVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session
    const savedUser = localStorage.getItem('user');
    const savedPasscodeVerified = localStorage.getItem('passcodeVerified');
    
    console.log('AuthContext - Initializing with savedUser:', savedUser, 'savedPasscodeVerified:', savedPasscodeVerified);
    
    if (savedUser && savedPasscodeVerified === 'true') {
      console.log('AuthContext - Setting authenticated user');
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
      setPasscodeVerified(true);
    } else if (savedPasscodeVerified === 'true' && !savedUser) {
      // Passcode verified but no user selected yet
      console.log('AuthContext - Passcode verified but no user selected');
      setPasscodeVerified(true);
      setIsAuthenticated(false);
      setUser(null);
    } else {
      // If no user or passcode not verified, ensure user is not authenticated
      console.log('AuthContext - No valid session, setting unauthenticated');
      setUser(null);
      setIsAuthenticated(false);
      setPasscodeVerified(false);
    }
    
    setLoading(false);
    console.log('AuthContext - Initialization complete');
  }, []);

  const login = async (userData) => {
    try {
      console.log('AuthContext - Login called with:', userData);
      // Store user data
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('passcodeVerified', 'true');
      console.log('AuthContext - Login successful');
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed' };
    }
  };

  const logout = () => {
    console.log('AuthContext - Logout called');
    setUser(null);
    setIsAuthenticated(false);
    setPasscodeVerified(false);
    localStorage.removeItem('user');
    localStorage.removeItem('passcodeVerified');
    console.log('AuthContext - Logout complete');
  };

  const clearAuth = () => {
    console.log('AuthContext - Clear auth called');
    setUser(null);
    setIsAuthenticated(false);
    setPasscodeVerified(false);
    localStorage.removeItem('user');
    localStorage.removeItem('passcodeVerified');
    console.log('AuthContext - Clear auth complete');
  };

  const value = {
    user,
    isAuthenticated,
    passcodeVerified,
    setPasscodeVerified,
    loading,
    login,
    logout,
    clearAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 