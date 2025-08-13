import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import PasscodeScreen from './components/auth/PasscodeScreen';
import Login from './components/auth/Login';
import Dashboard from './components/Dashboard';
import CreateMemory from './components/CreateMemory';
import Calendar from './components/Calendar';
import Gallery from './components/Gallery';
import Navbar from './components/Navbar';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366F1', // Indigo purple
      light: '#818CF8',
      dark: '#4F46E5',
    },
    secondary: {
      main: '#8B5CF6', // Purple
      light: '#A78BFA',
      dark: '#7C3AED',
    },
    background: {
      default: '#0F172A', // Dark blue
      paper: '#1E293B', // Lighter dark blue
    },
    surface: {
      main: '#334155', // Medium dark blue
      light: '#475569',
    },
    text: {
      primary: '#F8FAFC', // Light gray
      secondary: '#CBD5E1', // Medium gray
    },
    success: {
      main: '#10B981', // Green
    },
    warning: {
      main: '#F59E0B', // Amber
    },
    error: {
      main: '#EF4444', // Red
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
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
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
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          border: '1px solid rgba(99,102,241,0.2)',
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
            backgroundColor: 'rgba(30,41,59,0.8)',
            '& fieldset': {
              borderColor: 'rgba(99,102,241,0.3)',
              borderWidth: 2,
            },
            '&:hover fieldset': {
              borderColor: 'rgba(99,102,241,0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#6366F1',
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
          boxShadow: '0 16px 48px rgba(0,0,0,0.3)',
        },
      },
    },
  },
});

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  // Add debugging
  console.log('PrivateRoute - isAuthenticated:', isAuthenticated, 'loading:', loading);
  
  if (loading) { 
    console.log('PrivateRoute - Still loading...');
    return <div>Loading...</div>; 
  }
  
  if (!isAuthenticated) {
    console.log('PrivateRoute - Not authenticated, redirecting to /passcode');
    return <Navigate to="/passcode" />;
  }
  
  console.log('PrivateRoute - Authenticated, rendering children');
  return children;
};

function App() {
  console.log('App component rendered');
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/passcode" element={<PasscodeScreen />} />
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<PrivateRoute><><Navbar /><Dashboard /></></PrivateRoute>} />
              <Route path="/create-memory" element={<PrivateRoute><><Navbar /><CreateMemory /></></PrivateRoute>} />
              <Route path="/calendar" element={<PrivateRoute><><Navbar /><Calendar /></></PrivateRoute>} />
              <Route path="/gallery" element={<PrivateRoute><><Navbar /><Gallery /></></PrivateRoute>} />
              {/* Catch-all route - redirect to passcode for any unmatched routes */}
              <Route path="*" element={<Navigate to="/passcode" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
