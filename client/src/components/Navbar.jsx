import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar
} from '@mui/material';
import { Favorite, ExitToApp } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(102, 126, 234, 0.1)'
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Box sx={{ 
            width: 40, 
            height: 40, 
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 2
          }}>
            <Favorite sx={{ fontSize: 20, color: '#fff' }} />
          </Box>
          <Typography 
            variant="h6" 
            component="div"
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Niki & Amish's Date Journal
          </Typography>
        </Box>
        
        {isAuthenticated && user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar 
                sx={{ 
                  width: 36, 
                  height: 36, 
                  background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                  fontWeight: 600,
                  color: '#2d3748'
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="body2" sx={{ color: '#2d3748', fontWeight: 500 }}>
                {user.name}
              </Typography>
            </Box>
            <Button
              color="inherit"
              startIcon={<ExitToApp />}
              onClick={logout}
              sx={{ 
                textTransform: 'none',
                color: '#667eea',
                borderRadius: 2,
                px: 2,
                '&:hover': {
                  backgroundColor: 'rgba(102, 126, 234, 0.1)'
                }
              }}
            >
              Logout
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              color="inherit" 
              href="/login" 
              sx={{ 
                textTransform: 'none',
                color: '#667eea',
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'rgba(102, 126, 234, 0.1)'
                }
              }}
            >
              Login
            </Button>
            <Button 
              variant="outlined" 
              color="inherit" 
              href="/register"
              sx={{ 
                textTransform: 'none',
                color: '#667eea',
                borderColor: 'rgba(102, 126, 234, 0.3)',
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                  borderColor: '#667eea'
                }
              }}
            >
              Sign Up
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 