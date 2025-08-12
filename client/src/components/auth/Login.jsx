import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Button,
  Typography,
  Box,
  Alert
} from '@mui/material';
import { Favorite, Person } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleUserSelect = async (userType) => {
    setError('');
    setLoading(true);

    try {
      // Use a simple login system where userType determines the user
      const result = await login(userType);
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            width: '100%',
            textAlign: 'center',
            borderRadius: 4,
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Box sx={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3
            }}>
              <Favorite sx={{ fontSize: 50, color: '#fff' }} />
            </Box>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#2d3748' }}>
              Welcome to Your Date Journal
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              Choose who you are to continue
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              disabled={loading}
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
                },
                '&:disabled': {
                  background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
                  opacity: 0.7
                }
              }}
            >
              <Person sx={{ mr: 2, fontSize: 28 }} />
              I'm Niki
            </Button>

            <Button
              variant="contained"
              size="large"
              disabled={loading}
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
                },
                '&:disabled': {
                  background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                  opacity: 0.7
                }
              }}
            >
              <Person sx={{ mr: 2, fontSize: 28 }} />
              I'm Amish
            </Button>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
            Your memories will be marked with who created them
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 