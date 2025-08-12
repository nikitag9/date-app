import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, Grid, Card, CardContent, Button, Fab, Chip, Alert, Snackbar
} from '@mui/material';
import { Add, Favorite, CalendarMonth, PhotoLibrary, Person, GetApp, Close } from '@mui/icons-material';
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
    const userData = { id: userType, name: userType === 'niki' ? 'Niki' : 'Amish', type: userType };
    localStorage.setItem('user', JSON.stringify(userData));
    window.location.reload();
  };

  const handleCreateMemory = () => { navigate('/create-memory'); };
  const handleViewCalendar = () => { navigate('/calendar'); };
  const handleViewGallery = () => { navigate('/gallery'); };

  const handlePwaInstall = () => {
    setShowPwaPrompt(false);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const getUserColor = (userType) => {
    return userType === 'niki' ? 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)' : 'linear-gradient(135deg, #4ECDC4 0%, #7EDDD6 100%)';
  };

  if (showUserSelect) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #FFF8F0 0%, #FFE8D6 100%)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        py: 4,
        px: 2
      }}>
        <Container maxWidth="sm">
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ 
              width: { xs: 100, md: 120 }, 
              height: { xs: 100, md: 120 }, 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              mx: 'auto', 
              mb: 4,
              boxShadow: '0 16px 48px rgba(255,107,107,0.3)'
            }}>
              <Favorite sx={{ fontSize: { xs: 50, md: 60 }, color: '#fff' }} />
            </Box>
            <Typography variant="h3" component="h1" gutterBottom sx={{ 
              fontWeight: 700, 
              color: '#2D3748',
              fontSize: { xs: '2rem', md: '2.5rem' },
              mb: 2
            }}>
              Welcome to Your Date Journal
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ 
              mb: 4,
              fontSize: { xs: '1rem', md: '1.25rem' },
              color: '#718096'
            }}>
              Choose who you are to continue
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
              <Button 
                variant="contained" 
                size="large" 
                onClick={() => handleUserSelect('niki')} 
                sx={{ 
                  py: 3, 
                  background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)', 
                  borderRadius: 3, 
                  textTransform: 'none', 
                  fontSize: { xs: '1.1rem', md: '1.3rem' }, 
                  fontWeight: 600, 
                  color: '#fff', 
                  boxShadow: '0 8px 32px rgba(255,107,107,0.3)',
                  '&:hover': { 
                    background: 'linear-gradient(135deg, #E55555 0%, #FF6B6B 100%)', 
                    transform: 'translateY(-2px)', 
                    boxShadow: '0 12px 40px rgba(255,107,107,0.4)' 
                  } 
                }}
              >
                <Person sx={{ mr: 2, fontSize: { xs: 24, md: 28 } }} /> I'm Niki
              </Button>
              <Button 
                variant="contained" 
                size="large" 
                onClick={() => handleUserSelect('amish')} 
                sx={{ 
                  py: 3, 
                  background: 'linear-gradient(135deg, #4ECDC4 0%, #7EDDD6 100%)', 
                  borderRadius: 3, 
                  textTransform: 'none', 
                  fontSize: { xs: '1.1rem', md: '1.3rem' }, 
                  fontWeight: 600, 
                  color: '#fff', 
                  boxShadow: '0 8px 32px rgba(78,205,196,0.3)',
                  '&:hover': { 
                    background: 'linear-gradient(135deg, #3BA89F 0%, #4ECDC4 100%)', 
                    transform: 'translateY(-2px)', 
                    boxShadow: '0 12px 40px rgba(78,205,196,0.4)' 
                  } 
                }}
              >
                <Person sx={{ mr: 2, fontSize: { xs: 24, md: 28 } }} /> I'm Amish
              </Button>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ 
              fontSize: { xs: '0.875rem', md: '1rem' },
              color: '#718096'
            }}>
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
      background: 'linear-gradient(135deg, #FFF8F0 0%, #FFE8D6 100%)', 
      py: { xs: 2, md: 4 },
      px: 2
    }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ 
          mb: { xs: 3, md: 5 }, 
          textAlign: 'center',
          background: 'rgba(255,255,255,0.8)',
          borderRadius: 4,
          p: { xs: 3, md: 4 },
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.8)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.08)'
        }}>
          <Box sx={{ 
            width: { xs: 60, md: 80 }, 
            height: { xs: 60, md: 80 }, 
            borderRadius: '50%', 
            background: getUserColor(selectedUser), 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            mx: 'auto', 
            mb: 3,
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
          }}>
            <Favorite sx={{ color: '#fff', fontSize: { xs: 20, md: 24 } }} />
          </Box>
          <Typography variant="h4" sx={{ 
            fontWeight: 600, 
            color: '#2D3748',
            fontSize: { xs: '1.5rem', md: '2rem' },
            mb: 1
          }}>
            Hi, {selectedUser === 'niki' ? 'Niki' : 'Amish'}! 💕
          </Typography>
          <Typography variant="h3" component="h1" gutterBottom sx={{ 
            fontWeight: 700, 
            background: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)', 
            backgroundClip: 'text', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent', 
            mb: 2,
            fontSize: { xs: '1.75rem', md: '2.5rem' }
          }}>
            Niki & Amish's Date Journal
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ 
            mb: 0,
            fontWeight: 400, 
            fontSize: { xs: '1rem', md: '1.125rem' },
            color: '#718096',
            maxWidth: '600px',
            mx: 'auto'
          }}>
            Document and cherish your special moments together
          </Typography>
        </Box>

        {/* Action Cards */}
        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 5 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card onClick={handleCreateMemory} sx={{ 
              background: 'linear-gradient(135deg, #FFE8D6 0%, #FFD4B3 100%)', 
              borderRadius: 4, 
              boxShadow: '0 8px 32px rgba(255,212,179,0.3)', 
              cursor: 'pointer', 
              transition: 'all 0.3s ease', 
              height: '100%',
              '&:hover': { 
                transform: 'translateY(-8px)', 
                boxShadow: '0 16px 48px rgba(255,212,179,0.4)' 
              } 
            }}>
              <CardContent sx={{ textAlign: 'center', py: { xs: 3, md: 4 }, px: { xs: 2, md: 3 } }}>
                <Box sx={{ 
                  width: { xs: 60, md: 80 }, 
                  height: { xs: 60, md: 80 }, 
                  borderRadius: '50%', 
                  background: 'rgba(255,255,255,0.3)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  mx: 'auto', 
                  mb: 3,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                }}>
                  <Add sx={{ fontSize: { xs: 28, md: 36 }, color: '#fff' }} />
                </Box>
                <Typography variant="h6" sx={{ 
                  fontWeight: 600, 
                  color: '#2D3748', 
                  mb: 1,
                  fontSize: { xs: '1.1rem', md: '1.25rem' }
                }}>
                  Add New Memory
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#4A5568',
                  fontSize: { xs: '0.875rem', md: '1rem' }
                }}>
                  Create a new memory with photos and notes
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card onClick={handleViewCalendar} sx={{ 
              background: 'linear-gradient(135deg, #E6FFFA 0%, #B2F5EA 100%)', 
              borderRadius: 4, 
              boxShadow: '0 8px 32px rgba(178,245,234,0.3)', 
              cursor: 'pointer', 
              transition: 'all 0.3s ease', 
              height: '100%',
              '&:hover': { 
                transform: 'translateY(-8px)', 
                boxShadow: '0 16px 48px rgba(178,245,234,0.4)' 
              } 
            }}>
              <CardContent sx={{ textAlign: 'center', py: { xs: 3, md: 4 }, px: { xs: 2, md: 3 } }}>
                <Box sx={{ 
                  width: { xs: 60, md: 80 }, 
                  height: { xs: 60, md: 80 }, 
                  borderRadius: '50%', 
                  background: 'rgba(255,255,255,0.3)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  mx: 'auto', 
                  mb: 3,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                }}>
                  <CalendarMonth sx={{ fontSize: { xs: 28, md: 36 }, color: '#fff' }} />
                </Box>
                <Typography variant="h6" sx={{ 
                  fontWeight: 600, 
                  color: '#2D3748', 
                  mb: 1,
                  fontSize: { xs: '1.1rem', md: '1.25rem' }
                }}>
                  Calendar View
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#4A5568',
                  fontSize: { xs: '0.875rem', md: '1rem' }
                }}>
                  See your memories on a beautiful calendar
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card onClick={handleViewGallery} sx={{ 
              background: 'linear-gradient(135deg, #FED7D7 0%, #FEB2B2 100%)', 
              borderRadius: 4, 
              boxShadow: '0 8px 32px rgba(254,178,178,0.3)', 
              cursor: 'pointer', 
              transition: 'all 0.3s ease', 
              height: '100%',
              '&:hover': { 
                transform: 'translateY(-8px)', 
                boxShadow: '0 16px 48px rgba(254,178,178,0.4)' 
              } 
            }}>
              <CardContent sx={{ textAlign: 'center', py: { xs: 3, md: 4 }, px: { xs: 2, md: 3 } }}>
                <Box sx={{ 
                  width: { xs: 60, md: 80 }, 
                  height: { xs: 60, md: 80 }, 
                  borderRadius: '50%', 
                  background: 'rgba(255,255,255,0.3)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  mx: 'auto', 
                  mb: 3,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                }}>
                  <PhotoLibrary sx={{ fontSize: { xs: 28, md: 36 }, color: '#fff' }} />
                </Box>
                <Typography variant="h6" sx={{ 
                  fontWeight: 600, 
                  color: '#2D3748', 
                  mb: 1,
                  fontSize: { xs: '1.1rem', md: '1.25rem' }
                }}>
                  Memory Gallery
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#4A5568',
                  fontSize: { xs: '0.875rem', md: '1rem' }
                }}>
                  Browse all your memories in a gallery view
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Floating Action Button */}
        <Fab 
          sx={{ 
            background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
            position: 'fixed', 
            bottom: { xs: 16, md: 24 }, 
            right: { xs: 16, md: 24 },
            width: { xs: 56, md: 64 },
            height: { xs: 56, md: 64 },
            boxShadow: '0 8px 24px rgba(255,107,107,0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #E55555 0%, #FF6B6B 100%)',
              transform: 'scale(1.1)',
            }
          }} 
          onClick={handleCreateMemory}
        >
          <Add sx={{ fontSize: { xs: 24, md: 28 } }} />
        </Fab>

        {/* PWA Install Prompt Removed */}
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