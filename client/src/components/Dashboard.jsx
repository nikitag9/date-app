import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Fab,
  Chip,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Add,
  Favorite,
  CalendarMonth,
  PhotoLibrary,
  Person,
  GetApp,
  Close
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showUserSelect, setShowUserSelect] = useState(!user?.type);
  const [selectedUser, setSelectedUser] = useState(user?.type || '');
  const [showPwaPrompt, setShowPwaPrompt] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const isStandalone = (window.matchMedia('(display-mode: standalone)').matches);
    if (!isStandalone) {
      setShowPwaPrompt(true);
    }
  }, []);

  const handleUserSelect = (userType) => {
    setSelectedUser(userType);
    setShowUserSelect(false);
    // Update the user in localStorage
    const userData = {
      id: userType,
      name: userType === 'niki' ? 'Niki' : 'Amish',
      type: userType
    };
    localStorage.setItem('user', JSON.stringify(userData));
    // Reload the page to update the auth context
    window.location.reload();
  };

  const handleCreateMemory = () => {
    navigate('/create-memory');
  };

  const handleViewCalendar = () => {
    navigate('/calendar');
  };

  const handleViewGallery = () => {
    navigate('/gallery');
  };

  const handlePwaInstall = () => {
    setShowPwaPrompt(false);
    setSnackbarOpen(true);
    // Optionally, you can add a more robust PWA installation logic here
    // For example, using the Web App Manifest API
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const getUserColor = (userType) => {
    return userType === 'niki' 
      ? 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
      : 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)';
  };

  // User Selection Screen
  if (showUserSelect) {
    return (
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8f9ff 0%, #e8f4fd 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
      }}>
        <Container maxWidth="sm">
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 4
            }}>
              <Favorite sx={{ fontSize: 60, color: '#fff' }} />
            </Box>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#2d3748' }}>
              Welcome to Your Date Journal
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              Choose who you are to continue
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => handleUserSelect('niki')}
                sx={{ 
                  py: 3,
                  background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
                  borderRadius: 3,
                  textTransform: 'none',
                  fontSize: '1.3rem',
                  fontWeight: 600,
                  color: '#fff',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #ff8a8e 0%, #febfef 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(255, 154, 158, 0.3)'
                  }
                }}
              >
                <Person sx={{ mr: 2, fontSize: 28 }} />
                I'm Niki
              </Button>

              <Button
                variant="contained"
                size="large"
                onClick={() => handleUserSelect('amish')}
                sx={{ 
                  py: 3,
                  background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                  borderRadius: 3,
                  textTransform: 'none',
                  fontSize: '1.3rem',
                  fontWeight: 600,
                  color: '#fff',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #98dde0 0%, #fec6e3 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(168, 237, 234, 0.3)'
                  }
                }}
              >
                <Person sx={{ mr: 2, fontSize: 28 }} />
                I'm Amish
              </Button>
            </Box>

            <Typography variant="body2" color="text.secondary">
              Your memories will be marked with who created them
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8f9ff 0%, #e8f4fd 100%)',
      py: 3
    }}>
      <Container maxWidth="lg">
        {/* Welcome Section */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Box sx={{ width: 80, height: 80, borderRadius: '50%', background: getUserColor(selectedUser), display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
            <Favorite sx={{ color: '#fff', fontSize: 24 }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d3748' }}>Hi, {selectedUser === 'niki' ? 'Niki' : 'Amish'}!</Typography>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 2 }}>Niki & Amish's Date Journal</Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3, fontWeight: 400, fontSize: '1.1rem' }}
          >
            Document and cherish your special moments together
          </Typography>
        </Box>

        {/* Quick Actions */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card onClick={handleCreateMemory} sx={{ background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', borderRadius: 4, boxShadow: '0 8px 32px rgba(252, 182, 159, 0.2)', cursor: 'pointer', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 40px rgba(252, 182, 159, 0.3)' } }}>
              <CardContent sx={{ textAlign: 'center', py: 4, px: 3 }}>
                <Box sx={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
                  <Add sx={{ fontSize: 40, color: '#fff' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 1, fontSize: { xs: '1rem', md: '1.25rem' } }}>Add New Memory</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', fontSize: { xs: '0.875rem', md: '1rem' } }}>Create a new memory with photos and notes</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card onClick={handleViewCalendar} sx={{ background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', borderRadius: 4, boxShadow: '0 8px 32px rgba(168, 237, 234, 0.2)', cursor: 'pointer', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 40px rgba(168, 237, 234, 0.3)' } }}>
              <CardContent sx={{ textAlign: 'center', py: 4, px: 3 }}>
                <Box sx={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
                  <CalendarMonth sx={{ fontSize: 40, color: '#fff' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 1, fontSize: { xs: '1rem', md: '1.25rem' } }}>Calendar View</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', fontSize: { xs: '0.875rem', md: '1rem' } }}>See your memories on a beautiful calendar</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card onClick={handleViewGallery} sx={{ background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', borderRadius: 4, boxShadow: '0 8px 32px rgba(255, 154, 158, 0.2)', cursor: 'pointer', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 40px rgba(255, 154, 158, 0.3)' } }}>
              <CardContent sx={{ textAlign: 'center', py: 4, px: 3 }}>
                <Box sx={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
                  <PhotoLibrary sx={{ fontSize: 40, color: '#fff' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 1, fontSize: { xs: '1rem', md: '1.25rem' } }}>Memory Gallery</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', fontSize: { xs: '0.875rem', md: '1rem' } }}>Browse all your memories in a gallery view</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Floating Action Button */}
        <Fab 
          sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            position: 'fixed',
            bottom: 24,
            right: 24
          }} 
          onClick={handleCreateMemory}
        >
          <Add />
        </Fab>

        {/* PWA Install Prompt Removed - It doesn't actually work */}

        {/* Snackbar for PWA installation */}
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="info" sx={{ width: '100%' }}>
            App installed successfully! You can now use it as a standalone app.
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Dashboard; 