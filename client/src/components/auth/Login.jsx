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
import { Person } from '@mui/icons-material';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (userType) => {
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
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            width: '100%',
            textAlign: 'center',
            borderRadius: 4,
            background: 'rgba(30,41,59,0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(99,102,241,0.3)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.4)'
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Box sx={{
              width: { xs: 80, md: 100 },
              height: { xs: 80, md: 100 },
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              boxShadow: '0 16px 48px rgba(99,102,241,0.4)'
            }}>
              <Person sx={{ fontSize: { xs: 40, md: 50 }, color: '#fff' }} />
            </Box>
            <Typography variant="h3" component="h1" gutterBottom sx={{
              fontWeight: 700,
              color: '#F8FAFC',
              fontSize: { xs: '2rem', md: '2.5rem' },
              mb: 2
            }}>
              Hi!
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{
              mb: 4,
              fontSize: { xs: '1rem', md: '1.25rem' },
              color: '#CBD5E1'
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
              onClick={() => handleLogin('niki')}
              disabled={loading}
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
                },
                '&:disabled': {
                  background: '#475569',
                  color: '#64748B',
                  transform: 'none',
                  boxShadow: 'none'
                }
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: '#fff' }} />
              ) : (
                <>
                  <Person sx={{ mr: 2, fontSize: { xs: 24, md: 28 } }} />
                  I'm Niki
                </>
              )}
            </Button>

            <Button
              variant="contained"
              size="large"
              onClick={() => handleLogin('amish')}
              disabled={loading}
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
                },
                '&:disabled': {
                  background: '#475569',
                  color: '#64748B',
                  transform: 'none',
                  boxShadow: 'none'
                }
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: '#fff' }} />
              ) : (
                <>
                  <Person sx={{ mr: 2, fontSize: { xs: 24, md: 28 } }} />
                  I'm Amish
                </>
              )}
            </Button>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{
            fontSize: { xs: '0.875rem', md: '1rem' },
            color: '#64748B',
            fontStyle: 'italic'
          }}>
            Your memories will be marked with your name
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login; 