import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, useTheme, useMediaQuery, Drawer } from '@mui/material';
import { Favorite, Menu, Close, Person, CalendarMonth, PhotoLibrary } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

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
    color: isActive(path) ? '#6366F1' : '#F8FAFC',
    background: isActive(path) ? 'rgba(99,102,241,0.1)' : 'transparent',
    borderRadius: 2,
    px: 2,
    py: 1,
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.875rem',
    '&:hover': {
      background: isActive(path) ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.05)',
      color: '#6366F1'
    }
  });

  const getUserColor = (name) => {
    const colors = ['#FF6B6B', '#4F46E5', '#10B981', '#F59E0B', '#3B82F6'];
    const hash = name.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    return colors[hash % colors.length];
  };

  const getUserName = (name) => {
    if (!name) return 'Guest';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0];
    return `${parts[0]} ${parts[1][0]}.`;
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <Favorite /> },
    { path: '/create-memory', label: 'Create Memory', icon: <Favorite /> },
    { path: '/calendar', label: 'Calendar', icon: <CalendarMonth /> },
    { path: '/gallery', label: 'Gallery', icon: <PhotoLibrary /> },
  ];

  const handleMobileMenuOpen = () => {
    setMobileMenuOpen(true);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  if (!user) return null;

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        background: 'rgba(15,23,42,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(99,102,241,0.3)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            mr: 3,
            cursor: 'pointer'
          }} onClick={() => navigate('/')}>
            <Box sx={{
              width: { xs: 36, md: 40 },
              height: { xs: 36, md: 40 },
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
              boxShadow: '0 4px 16px rgba(99,102,241,0.4)'
            }}>
              <Favorite sx={{ fontSize: { xs: 18, md: 20 }, color: '#fff' }} />
            </Box>
            <Typography variant="h6" sx={{
              fontWeight: 700,
              color: '#F8FAFC',
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              display: { xs: 'none', sm: 'block' }
            }}>
              Date Journal
            </Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                onClick={() => navigate(item.path)}
                sx={getNavButtonStyle(item.path)}
              >
                {item.icon}
                <Typography sx={{ ml: 1, fontSize: '0.875rem' }}>
                  {item.label}
                </Typography>
              </Button>
            ))}
          </Box>
        </Box>

        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(30,41,59,0.8)',
            borderRadius: 3,
            px: 2,
            py: 1,
            border: '1px solid rgba(99,102,241,0.2)'
          }}>
            <Box sx={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: getUserColor(user?.name || 'niki'),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 1.5
            }}>
              <Person sx={{ fontSize: 16, color: '#fff' }} />
            </Box>
            <Typography variant="body2" sx={{
              color: '#F8FAFC',
              fontWeight: 600,
              fontSize: '0.875rem'
            }}>
              {getUserName(user?.name || 'niki')}
            </Typography>
          </Box>

          <Button
            variant="outlined"
            onClick={handleLogout}
            sx={{
              borderRadius: 3,
              borderColor: 'rgba(99,102,241,0.3)',
              color: '#6366F1',
              borderWidth: 2,
              px: 2,
              py: 1,
              fontSize: '0.875rem',
              fontWeight: 600,
              '&:hover': {
                borderColor: '#6366F1',
                background: 'rgba(99,102,241,0.1)',
                transform: 'translateY(-1px)'
              }
            }}
          >
            Logout
          </Button>

          <IconButton
            sx={{
              display: { md: 'none' },
              color: '#6366F1',
              background: 'rgba(99,102,241,0.1)',
              '&:hover': { background: 'rgba(99,102,241,0.2)' }
            }}
            onClick={handleMobileMenuOpen}
          >
            <Menu />
          </IconButton>
        </Box>
      </Toolbar>

      <Drawer
        anchor="bottom"
        open={mobileMenuOpen}
        onClose={handleMobileMenuClose}
        PaperProps={{
          sx: {
            background: 'rgba(15,23,42,0.98)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(99,102,241,0.3)',
            borderRadius: '16px 16px 0 0'
          }
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ color: '#F8FAFC', fontWeight: 600 }}>
              Menu
            </Typography>
            <IconButton onClick={handleMobileMenuClose} sx={{ color: '#6366F1' }}>
              <Close />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  handleMobileMenuClose();
                }}
                fullWidth
                sx={{
                  justifyContent: 'flex-start',
                  py: 2,
                  px: 3,
                  borderRadius: 3,
                  background: location.pathname === item.path ? 'rgba(99,102,241,0.2)' : 'transparent',
                  color: location.pathname === item.path ? '#6366F1' : '#F8FAFC',
                  border: location.pathname === item.path ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(99,102,241,0.1)',
                  '&:hover': {
                    background: 'rgba(99,102,241,0.1)',
                    border: '1px solid rgba(99,102,241,0.3)'
                  }
                }}
              >
                {item.icon}
                <Typography sx={{ ml: 2, fontSize: '1rem', fontWeight: 500 }}>
                  {item.label}
                </Typography>
              </Button>
            ))}
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar; 