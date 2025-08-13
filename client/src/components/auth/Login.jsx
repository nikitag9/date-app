import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import { Favorite, Person } from '@mui/icons-material';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUserSelect = async (userType) => {
    setLoading(true);
    setError('');
    
    try {
      const userData = {
        id: userType,
        name: userType === 'niki' ? 'Niki' : 'Amish',
        type: userType
      };
      
      await login(userData);
      navigate('/');
    } catch (err) {
      setError('Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getUserColor = (userType) => {
    return userType === 'niki' 
      ? 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)'
      : 'linear-gradient(135deg, #4ECDC4 0%, #7EDDD6 100%)';
  };

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
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            width: '100%',
            textAlign: 'center',
            borderRadius: 4,
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.8)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.08)'
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Box sx={{
              width: { xs: 80, md: 100 },
              height: { xs: 80, md: 100 },
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              boxShadow: '0 16px 48px rgba(255,107,107,0.3)'
            }}>
              <Favorite sx={{ fontSize: { xs: 40, md: 50 }, color: '#fff' }} />
            </Box>
            <Typography variant="h3" component="h1" gutterBottom sx={{ 
              fontWeight: 700, 
              color: '#2D3748',
              fontSize: { xs: '2rem', md: '2.5rem' },
              mb: 2
            }}>
              Welcome Back!
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ 
              mb: 4,
              fontSize: { xs: '1rem', md: '1.25rem' },
              color: '#718096'
            }}>
              Choose who you are to continue
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => handleUserSelect('niki')}
              disabled={loading}
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
                },
                '&:disabled': {
                  background: '#E2E8F0',
                  color: '#A0AEC0',
                  transform: 'none',
                  boxShadow: 'none'
                }
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: '#fff', mr: 1 }} />
              ) : (
                <Person sx={{ mr: 2, fontSize: { xs: 24, md: 28 } }} />
              )}
              I'm Niki
            </Button>

            <Button
              variant="contained"
              size="large"
              onClick={() => handleUserSelect('amish')}
              disabled={loading}
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
                },
                '&:disabled': {
                  background: '#E2E8F0',
                  color: '#A0AEC0',
                  transform: 'none',
                  boxShadow: 'none'
                }
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: '#fff', mr: 1 }} />
              ) : (
                <Person sx={{ mr: 2, fontSize: { xs: 24, md: 28 } }} />
              )}
              I'm Amish
            </Button>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ 
            fontSize: { xs: '0.875rem', md: '1rem' },
            color: '#718096',
            fontStyle: 'italic'
          }}>
            Your memories will be marked with who created them
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login; 