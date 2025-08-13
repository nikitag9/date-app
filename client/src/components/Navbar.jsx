import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { Favorite, Menu, Close } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getNavButtonStyle = (path) => ({
    color: isActive(path) ? '#FF6B6B' : '#2D3748',
    background: isActive(path) ? 'rgba(255,107,107,0.1)' : 'transparent',
    borderRadius: 2,
    px: 2,
    py: 1,
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.875rem',
    '&:hover': {
      background: isActive(path) ? 'rgba(255,107,107,0.2)' : 'rgba(255,107,107,0.05)',
      color: '#FF6B6B'
    }
  });

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  if (!user) return null;

  return (
    <>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          background: 'rgba(255,255,255,0.95)', 
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,107,107,0.1)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 3 } }}>
          {/* Logo/Brand */}
          <Box 
            onClick={() => navigate('/')} 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              mr: { xs: 2, md: 4 }
            }}
          >
            <Box sx={{
              width: { xs: 32, md: 40 },
              height: { xs: 32, md: 40 },
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 1.5,
              boxShadow: '0 4px 16px rgba(255,107,107,0.3)'
            }}>
              <Favorite sx={{ fontSize: { xs: 18, md: 22 }, color: '#fff' }} />
            </Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                color: '#2D3748',
                fontSize: { xs: '1rem', md: '1.25rem' },
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Date Journal
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, flex: 1 }}>
              <Button 
                onClick={() => navigate('/')} 
                sx={getNavButtonStyle('/')}
              >
                Dashboard
              </Button>
              <Button 
                onClick={() => navigate('/create-memory')} 
                sx={getNavButtonStyle('/create-memory')}
              >
                Create Memory
              </Button>
              <Button 
                onClick={() => navigate('/calendar')} 
                sx={getNavButtonStyle('/calendar')}
              >
                Calendar
              </Button>
              <Button 
                onClick={() => navigate('/gallery')} 
                sx={getNavButtonStyle('/gallery')}
              >
                Gallery
              </Button>
            </Box>
          )}

          {/* User Info & Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              background: 'rgba(255,107,107,0.1)', 
              borderRadius: 3, 
              px: 2, 
              py: 1,
              border: '1px solid rgba(255,107,107,0.2)'
            }}>
              <Typography variant="body2" sx={{ 
                fontWeight: 600, 
                color: '#2D3748',
                fontSize: '0.875rem'
              }}>
                {user.name}
              </Typography>
            </Box>
            
            {!isMobile && (
              <Button 
                onClick={handleLogout}
                variant="outlined"
                sx={{ 
                  borderColor: 'rgba(255,107,107,0.3)',
                  color: '#FF6B6B',
                  borderWidth: 2,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  px: 2,
                  '&:hover': {
                    borderColor: '#FF6B6B',
                    background: 'rgba(255,107,107,0.1)',
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                Logout
              </Button>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                onClick={toggleMobileMenu}
                sx={{ 
                  color: '#FF6B6B',
                  background: 'rgba(255,107,107,0.1)',
                  '&:hover': { background: 'rgba(255,107,107,0.2)' }
                }}
              >
                {mobileMenuOpen ? <Close /> : <Menu />}
              </IconButton>
            )}
          </Box>
        </Toolbar>

        {/* Mobile Navigation Menu */}
        {isMobile && mobileMenuOpen && (
          <Box sx={{ 
            background: 'rgba(255,255,255,0.98)', 
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(255,107,107,0.1)',
            py: 2,
            px: 2
          }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button 
                onClick={() => { navigate('/'); setMobileMenuOpen(false); }} 
                sx={getNavButtonStyle('/')}
                fullWidth
                justifyContent="flex-start"
              >
                Dashboard
              </Button>
              <Button 
                onClick={() => { navigate('/create-memory'); setMobileMenuOpen(false); }} 
                sx={getNavButtonStyle('/create-memory')}
                fullWidth
                justifyContent="flex-start"
              >
                Create Memory
              </Button>
              <Button 
                onClick={() => { navigate('/calendar'); setMobileMenuOpen(false); }} 
                sx={getNavButtonStyle('/calendar')}
                fullWidth
                justifyContent="flex-start"
              >
                Calendar
              </Button>
              <Button 
                onClick={() => { navigate('/gallery'); setMobileMenuOpen(false); }} 
                sx={getNavButtonStyle('/gallery')}
                fullWidth
                justifyContent="flex-start"
              >
                Gallery
              </Button>
              <Button 
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                variant="outlined"
                sx={{ 
                  borderColor: 'rgba(255,107,107,0.3)',
                  color: '#FF6B6B',
                  borderWidth: 2,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  px: 2,
                  mt: 1,
                  '&:hover': {
                    borderColor: '#FF6B6B',
                    background: 'rgba(255,107,107,0.1)'
                  }
                }}
                fullWidth
              >
                Logout
              </Button>
            </Box>
          </Box>
        )}
      </AppBar>
    </>
  );
};

export default Navbar; 