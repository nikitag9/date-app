import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Add,
  Delete,
  CloudUpload,
  LocationOn,
  CalendarToday,
  ArrowBack,
  Save,
  Person,
  Image
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const CreateMemory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showUserSelect, setShowUserSelect] = useState(!user?.type);
  const [selectedUser, setSelectedUser] = useState(user?.type || '');
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    notes: '',
    images: []
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleUserSelect = (userType) => {
    setSelectedUser(userType);
    setShowUserSelect(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, {
            file: file,
            preview: e.target.result,
            name: file.name
          }]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.date || formData.images.length === 0) {
      setError('Please fill in all required fields');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Upload images first
      const imageUrls = [];
      for (const image of formData.images) {
        const formDataImage = new FormData();
        formDataImage.append('image', image);

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
        const response = await fetch(`${API_URL}/api/upload/single`, {
          method: 'POST',
          body: formDataImage,
        });

        if (!response.ok) {
          throw new Error('Failed to upload image');
        }

        const result = await response.json();
        imageUrls.push(result.filename);
      }

      // Create memory
      const memoryData = {
        title: formData.title,
        date: formData.date,
        location: formData.location || '',
        notes: formData.notes || '',
        images: imageUrls,
        creator: user
      };

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const response = await fetch(`${API_URL}/api/memories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(memoryData)
      });

      if (response.ok) {
        navigate('/');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create memory');
      }
    } catch (err) {
      setError('Failed to create memory. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const getUserName = (userType) => {
    return userType === 'niki' ? 'Niki' : 'Amish';
  };

  const getUserColor = (userType) => {
    return userType === 'niki' 
      ? 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)'
      : 'linear-gradient(135deg, #4ECDC4 0%, #7EDDD6 100%)';
  };

  // User Selection Dialog
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
              <Typography variant="h4" component="h1" gutterBottom sx={{ 
                fontWeight: 700, 
                color: '#F8FAFC',
                fontSize: { xs: '1.5rem', md: '2.125rem' }
              }}>
                Who's Creating This Memory?
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ 
                mb: 4,
                fontSize: { xs: '1rem', md: '1.25rem' },
                color: '#CBD5E1'
              }}>
                Choose who you are to continue
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
                <Person sx={{ mr: 2, fontSize: { xs: 24, md: 28 } }} />
                I'm Niki
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
                <Person sx={{ mr: 2, fontSize: { xs: 24, md: 28 } }} />
                I'm Amish
              </Button>
            </Box>

            <Button
              variant="outlined"
              onClick={() => navigate('/')}
              sx={{ 
                mt: 4,
                borderRadius: 3,
                borderColor: 'rgba(99,102,241,0.3)',
                color: '#6366F1',
                borderWidth: 2,
                px: 4,
                py: 1.5,
                '&:hover': {
                  borderColor: '#6366F1',
                  background: 'rgba(99,102,241,0.1)',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              Cancel
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)',
      py: { xs: 2, md: 3 },
      px: 2
    }}>
      <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
        <Paper elevation={0} sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          background: 'rgba(30,41,59,0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(99,102,241,0.3)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.4)'
        }}>
          <Box sx={{ mb: { xs: 3, md: 4 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, md: 3 } }}>
              <IconButton 
                onClick={() => navigate('/')} 
                sx={{ 
                  mr: 2,
                  background: 'rgba(99,102,241,0.1)',
                  color: '#6366F1',
                  '&:hover': {
                    background: 'rgba(99,102,241,0.2)'
                  }
                }}
              >
                <ArrowBack sx={{ fontSize: { xs: 20, md: 24 } }} />
              </IconButton>
              <Typography variant="h4" component="h1" sx={{
                fontWeight: 700,
                color: '#F8FAFC',
                fontSize: { xs: '1.5rem', md: '2rem' }
              }}>
                Create New Memory
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{
              color: '#CBD5E1',
              fontSize: { xs: '0.9rem', md: '1rem' },
              lineHeight: 1.6
            }}>
              Capture your special moments with photos, notes, and details
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={{ xs: 2, md: 3 }}>
              <Grid item xs={12}>
                <TextField 
                  fullWidth 
                  label="Memory Title *" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleInputChange} 
                  variant="outlined" 
                  required
                  InputProps={{ 
                    startAdornment: (<InputAdornment position="start"><Add sx={{ color: '#6366F1', fontSize: { xs: 20, md: 24 } }} /></InputAdornment>) 
                  }} 
                  sx={{ 
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
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '1rem', md: '1rem' },
                      color: '#CBD5E1'
                    },
                    '& .MuiOutlinedInput-input': {
                      fontSize: { xs: '1rem', md: '1rem' },
                      padding: { xs: '16px 14px', md: '16px 14px' }
                    }
                  }} 
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  label="Date *" 
                  name="date" 
                  type="date" 
                  value={formData.date} 
                  onChange={handleInputChange} 
                  variant="outlined" 
                  required
                  InputLabelProps={{ shrink: true }} 
                  InputProps={{ 
                    startAdornment: (<InputAdornment position="start"><CalendarToday sx={{ color: '#6366F1', fontSize: { xs: 20, md: 24 } }} /></InputAdornment>) 
                  }} 
                  sx={{ 
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
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '1rem', md: '1rem' },
                      color: '#CBD5E1'
                    },
                    '& .MuiOutlinedInput-input': {
                      fontSize: { xs: '1rem', md: '1rem' },
                      padding: { xs: '16px 14px', md: '16px 14px' }
                    }
                  }} 
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  label="Location" 
                  name="location" 
                  value={formData.location} 
                  onChange={handleInputChange} 
                  variant="outlined" 
                  InputProps={{ 
                    startAdornment: (<InputAdornment position="start"><LocationOn sx={{ color: '#6366F1', fontSize: { xs: 20, md: 24 } }} /></InputAdornment>) 
                  }} 
                  sx={{ 
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
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '1rem', md: '1rem' },
                      color: '#CBD5E1'
                    },
                    '& .MuiOutlinedInput-input': {
                      fontSize: { xs: '1rem', md: '1rem' },
                      padding: { xs: '16px 14px', md: '16px 14px' }
                    }
                  }} 
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  fullWidth 
                  label="Notes" 
                  name="notes" 
                  multiline 
                  rows={4} 
                  value={formData.notes} 
                  onChange={handleInputChange} 
                  variant="outlined" 
                  sx={{ 
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
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '1rem', md: '1rem' },
                      color: '#CBD5E1'
                    },
                    '& .MuiOutlinedInput-input': {
                      fontSize: { xs: '1rem', md: '1rem' },
                      padding: { xs: '16px 14px', md: '16px 14px' }
                    }
                  }} 
                />
              </Grid>
              <Grid item xs={12}>
                <Button 
                  variant="outlined" 
                  component="label" 
                  fullWidth 
                  sx={{ 
                    py: { xs: 3, md: 2.5 }, 
                    borderRadius: 3, 
                    borderColor: 'rgba(99,102,241,0.3)', 
                    borderWidth: 2,
                    color: '#6366F1', 
                    fontSize: { xs: '1rem', md: '1rem' },
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    minHeight: { xs: '56px', md: '48px' },
                    '&:hover': { 
                      borderColor: '#6366F1', 
                      background: 'rgba(99,102,241,0.1)',
                      transform: 'translateY(-1px)'
                    } 
                  }}
                >
                  <Image sx={{ fontSize: { xs: 20, md: 24 } }} /> 
                  <span>Upload Image *</span>
                  <input type="file" hidden onChange={handleImageUpload} accept="image/*" required />
                </Button>
                {formData.images.length > 0 && (
                  <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: { xs: 1, md: 2 } }}>
                    {formData.images.map((image, index) => (
                      <Card key={index} sx={{ 
                        position: 'relative', 
                        borderRadius: 3, 
                        overflow: 'hidden',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                        transition: 'all 0.3s ease',
                        background: 'rgba(30,41,59,0.8)',
                        border: '1px solid rgba(99,102,241,0.2)',
                        width: { xs: 'calc(50% - 4px)', sm: 'calc(33.33% - 8px)', md: '200px' },
                        '&:hover': {
                          transform: 'scale(1.02)',
                          boxShadow: '0 12px 32px rgba(0,0,0,0.4)'
                        }
                      }}>
                        <CardMedia 
                          component="img" 
                          height={{ xs: 120, sm: 140, md: 160 }} 
                          image={image.preview} 
                          alt={image.name} 
                          sx={{ objectFit: 'cover' }} 
                        />
                        <IconButton 
                          onClick={() => removeImage(index)} 
                          sx={{ 
                            position: 'absolute', 
                            top: 8, 
                            right: 8, 
                            background: 'rgba(30,41,59,0.9)', 
                            color: '#EF4444',
                            width: { xs: 32, md: 40 },
                            height: { xs: 32, md: 40 },
                            '&:hover': { 
                              background: '#EF4444',
                              color: '#fff'
                            } 
                          }}
                        >
                          <Delete sx={{ fontSize: { xs: 16, md: 20 } }} />
                        </IconButton>
                      </Card>
                    ))}
                  </Box>
                )}
              </Grid>
              <Grid item xs={12}>
                <Button 
                  type="submit" 
                  fullWidth 
                  variant="contained" 
                  size="large" 
                  disabled={uploading || !formData.title || !formData.date || formData.images.length === 0} 
                  sx={{ 
                    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                    borderRadius: 3, 
                    textTransform: 'none',
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    fontWeight: 600,
                    py: { xs: 3, md: 2.5 },
                    minHeight: { xs: '56px', md: '48px' },
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
                  {uploading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={20} sx={{ color: '#fff' }} />
                      <span>Creating Memory...</span>
                    </Box>
                  ) : (
                    'Save Memory'
                  )}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default CreateMemory; 