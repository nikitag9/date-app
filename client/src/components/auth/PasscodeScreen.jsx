import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Favorite, Visibility, VisibilityOff, Lock } from '@mui/icons-material';

const PasscodeScreen = () => {
  const navigate = useNavigate();
  const { setPasscodeVerified, clearAuth } = useAuth();
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Add debugging
  console.log('PasscodeScreen - Component rendered');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('PasscodeScreen - Submit called with passcode:', passcode);
    if (passcode === 'namish') {
      console.log('PasscodeScreen - Correct passcode, setting verified and navigating to login');
      setPasscodeVerified(true);
      localStorage.setItem('passcodeVerified', 'true');
      navigate('/login');
    } else {
      console.log('PasscodeScreen - Incorrect passcode');
      setError('Incorrect passcode. Please try again.');
      setPasscode('');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
              <Lock sx={{ fontSize: { xs: 40, md: 50 }, color: '#fff' }} />
            </Box>
            <Typography variant="h3" component="h1" gutterBottom sx={{ 
              fontWeight: 700, 
              color: '#F8FAFC',
              fontSize: { xs: '2rem', md: '2.5rem' },
              mb: 2
            }}>
              Private Access
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ 
              mb: 4,
              fontSize: { xs: '1rem', md: '1.25rem' },
              color: '#CBD5E1'
            }}>
              Enter the passcode to access your date journal
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Passcode"
              type={showPassword ? 'text' : 'password'}
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              variant="outlined"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: '#6366F1' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                      sx={{ color: '#6366F1' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{
                mb: 4,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  background: 'rgba(15,23,42,0.6)',
                  '& fieldset': {
                    borderColor: 'rgba(99,102,241,0.3)',
                    borderWidth: 2
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(99,102,241,0.5)'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#6366F1'
                  }
                }
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={!passcode.trim()}
              sx={{
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                borderRadius: 3,
                textTransform: 'none',
                fontSize: '1.1rem',
                fontWeight: 600,
                py: 2,
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
              Access Journal
            </Button>
          </Box>

          {/* Temporary testing button - remove this later */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              variant="outlined"
              size="small"
              onClick={clearAuth}
              sx={{
                borderColor: 'rgba(239,68,68,0.3)',
                color: '#EF4444',
                fontSize: '0.75rem',
                '&:hover': {
                  borderColor: '#EF4444',
                  background: 'rgba(239,68,68,0.1)'
                }
              }}
            >
              Clear Auth (Testing)
            </Button>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ 
            mt: 4,
            fontSize: { xs: '0.875rem', md: '1rem' },
            color: '#64748B',
            fontStyle: 'italic'
          }}>
            This is a private space for you and Amish only
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default PasscodeScreen; 