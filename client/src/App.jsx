import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import Login from './components/auth/Login';
import Dashboard from './components/Dashboard';
import CreateMemory from './components/CreateMemory';
import Calendar from './components/Calendar';
import Gallery from './components/Gallery';
import Navbar from './components/Navbar';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF6B6B', // Warm coral red
      light: '#FF8E8E',
      dark: '#E55555',
    },
    secondary: {
      main: '#4ECDC4', // Soft teal
      light: '#7EDDD6',
      dark: '#3BA89F',
    },
    background: {
      default: '#FFF8F0', // Warm cream
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2D3748',
      secondary: '#718096',
    },
    success: {
      main: '#68D391', // Soft green
    },
    warning: {
      main: '#F6AD55', // Warm orange
    },
    error: {
      main: '#FC8181', // Soft red
    },
  },
  typography: {
    fontFamily: '"Inter", "Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { 
      fontWeight: 700, 
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: { 
      fontWeight: 600, 
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h3: { 
      fontWeight: 600, 
      fontSize: '1.75rem',
      lineHeight: 1.3,
    },
    h4: { 
      fontWeight: 600, 
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: { 
      fontWeight: 600, 
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h6: { 
      fontWeight: 600, 
      fontSize: '1.125rem',
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 16,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 600,
          fontSize: '1rem',
          padding: '12px 24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #E55555 0%, #FF6B6B 100%)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          border: '1px solid rgba(255,255,255,0.8)',
          backdropFilter: 'blur(20px)',
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: 'rgba(255,255,255,0.8)',
            '& fieldset': {
              borderColor: 'rgba(255,107,107,0.2)',
              borderWidth: 2,
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255,107,107,0.4)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#FF6B6B',
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontWeight: 600,
          fontSize: '0.875rem',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow: '0 16px 48px rgba(0,0,0,0.08)',
        },
      },
    },
  },
});

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) { return <div>Loading...</div>; }
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/create-memory" element={<PrivateRoute><CreateMemory /></PrivateRoute>} />
              <Route path="/calendar" element={<PrivateRoute><Calendar /></PrivateRoute>} />
              <Route path="/gallery" element={<PrivateRoute><Gallery /></PrivateRoute>} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
