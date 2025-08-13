import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Fab,
  Snackbar,
  Alert,
  Chip
} from '@mui/material';
import {
  Add,
  CalendarMonth,
  PhotoLibrary,
  Favorite,
  Person
} from '@mui/icons-material';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserSelect, setShowUserSelect] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setSelectedUser(user.type);
    }
  }, [user]);

  const handleUserSelect = (userType) => {
    setSelectedUser(userType);
    setShowUserSelect(false);
    // Update user in context
    const updatedUser = { ...user, type: userType };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    window.location.reload(); // Refresh to update context
  };

  const handleCreateMemory = () => {
    if (!selectedUser) {
      setShowUserSelect(true);
    } else {
      navigate('/create-memory');
    }
  };

  const handleViewCalendar = () => {
    navigate('/calendar');
  };

  const handleViewGallery = () => {
    navigate('/gallery');
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const getUserColor = (userType) => {
    return userType === 'niki' 
      ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' 
      : 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)';
  };

  const getUserGradient = (userType) => {
    return userType === 'niki' 
      ? 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' 
      : 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)';
  };

  // User Selection Screen
  if (showUserSelect) {
    return (
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)',
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
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 4,
              boxShadow: '0 16px 48px rgba(99,102,241,0.4)'
            }}>
              <Favorite sx={{ fontSize: { xs: 50, md: 60 }, color: '#fff' }} />
            </Box>
            <Typography variant="h3" component="h1" gutterBottom sx={{
              fontWeight: 700,
              color: '#F8FAFC',
              fontSize: { xs: '2rem', md: '2.5rem' },
              mb: 2
            }}>
              Welcome to Your Date Journal
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{
              mb: 4,
              fontSize: { xs: '1rem', md: '1.25rem' },
              color: '#CBD5E1'
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
                  background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                  borderRadius: 3,
                  textTransform: 'none',
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  fontWeight: 600,
                  color: '#fff',
                  boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px rgba(99,102,241,0.5)'
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
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)',
                  borderRadius: 3,
                  textTransform: 'none',
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  fontWeight: 600,
                  color: '#fff',
                  boxShadow: '0 8px 32px rgba(139,92,246,0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px rgba(139,92,246,0.5)'
                  }
                }}
              >
                <Person sx={{ mr: 2, fontSize: { xs: 24, md: 28 } }} /> I'm Amish
              </Button>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{
              fontSize: { xs: '0.875rem', md: '1rem' },
              color: '#64748B'
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
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)',
      py: { xs: 2, md: 4 },
      px: 2
    }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{
          mb: { xs: 3, md: 5 },
          textAlign: 'center',
          background: 'rgba(30,41,59,0.8)',
          borderRadius: 4,
          p: { xs: 3, md: 4 },
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(99,102,241,0.3)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.4)'
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
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
          }}>
            <Favorite sx={{ color: '#fff', fontSize: { xs: 20, md: 24 } }} />
          </Box>
          <Typography variant="h4" sx={{
            fontWeight: 600,
            color: '#F8FAFC',
            fontSize: { xs: '1.5rem', md: '2rem' },
            mb: 1
          }}>
            Hi, {selectedUser === 'niki' ? 'Niki' : 'Amish'}! 💕
          </Typography>
          <Typography variant="h3" component="h1" gutterBottom sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
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
            color: '#CBD5E1',
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
              background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
              borderRadius: 4,
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              height: '100%',
              border: '1px solid rgba(99,102,241,0.2)',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
                border: '1px solid rgba(99,102,241,0.4)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center', py: { xs: 3, md: 4 }, px: { xs: 2, md: 3 } }}>
                <Box sx={{
                  width: { xs: 60, md: 80 },
                  height: { xs: 60, md: 80 },
                  borderRadius: '50%',
                  background: 'rgba(99,102,241,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
                }}>
                  <Add sx={{ fontSize: { xs: 28, md: 36 }, color: '#6366F1' }} />
                </Box>
                <Typography variant="h6" sx={{
                  fontWeight: 600,
                  color: '#F8FAFC',
                  mb: 1,
                  fontSize: { xs: '1.1rem', md: '1.25rem' }
                }}>
                  Add New Memory
                </Typography>
                <Typography variant="body2" sx={{
                  color: '#CBD5E1',
                  fontSize: { xs: '0.875rem', md: '1rem' }
                }}>
                  Create a new memory with photos and notes
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card onClick={handleViewCalendar} sx={{
              background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
              borderRadius: 4,
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              height: '100%',
              border: '1px solid rgba(139,92,246,0.2)',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
                border: '1px solid rgba(139,92,246,0.4)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center', py: { xs: 3, md: 4 }, px: { xs: 2, md: 3 } }}>
                <Box sx={{
                  width: { xs: 60, md: 80 },
                  height: { xs: 60, md: 80 },
                  borderRadius: '50%',
                  background: 'rgba(139,92,246,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
                }}>
                  <CalendarMonth sx={{ fontSize: { xs: 28, md: 36 }, color: '#8B5CF6' }} />
                </Box>
                <Typography variant="h6" sx={{
                  fontWeight: 600,
                  color: '#F8FAFC',
                  mb: 1,
                  fontSize: { xs: '1.1rem', md: '1.25rem' }
                }}>
                  Calendar View
                </Typography>
                <Typography variant="body2" sx={{
                  color: '#CBD5E1',
                  fontSize: { xs: '0.875rem', md: '1rem' }
                }}>
                  See your memories on a beautiful calendar
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card onClick={handleViewGallery} sx={{
              background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
              borderRadius: 4,
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              height: '100%',
              border: '1px solid rgba(168,85,247,0.2)',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
                border: '1px solid rgba(168,85,247,0.4)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center', py: { xs: 3, md: 4 }, px: { xs: 2, md: 3 } }}>
                <Box sx={{
                  width: { xs: 60, md: 80 },
                  height: { xs: 60, md: 80 },
                  borderRadius: '50%',
                  background: 'rgba(168,85,247,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
                }}>
                  <PhotoLibrary sx={{ fontSize: { xs: 28, md: 36 }, color: '#A855F7' }} />
                </Box>
                <Typography variant="h6" sx={{
                  fontWeight: 600,
                  color: '#F8FAFC',
                  mb: 1,
                  fontSize: { xs: '1.1rem', md: '1.25rem' }
                }}>
                  Memory Gallery
                </Typography>
                <Typography variant="body2" sx={{
                  color: '#CBD5E1',
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
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            position: 'fixed',
            bottom: { xs: 16, md: 24 },
            right: { xs: 16, md: 24 },
            width: { xs: 56, md: 64 },
            height: { xs: 56, md: 64 },
            boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
              transform: 'scale(1.1)',
            }
          }}
          onClick={handleCreateMemory}
        >
          <Add sx={{ fontSize: { xs: 24, md: 28 } }} />
        </Fab>

        {/* Snackbar */}
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="info" sx={{ width: '100%' }}>
            Add to Home Screen for a full app experience!
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Dashboard; 