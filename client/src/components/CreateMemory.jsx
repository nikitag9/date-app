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
  Person
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
    setError('');
    
    if (!selectedUser) {
      setError('Please select who is creating this memory');
      return;
    }

    setUploading(true);

    try {
      // Upload images first
      const uploadedImages = [];
      for (const image of formData.images) {
        const formDataImage = new FormData();
        formDataImage.append('image', image.file);
        
        const response = await fetch('http://localhost:5001/api/upload/single', {
          method: 'POST',
          body: formDataImage
        });
        
        if (response.ok) {
          const result = await response.json();
          uploadedImages.push(result.imageUrl);
        }
      }

      // Create memory
      const memoryData = {
        title: formData.title,
        date: formData.date,
        location: formData.location,
        notes: formData.notes,
        images: uploadedImages,
        creator: selectedUser
      };

      const response = await fetch('http://localhost:5001/api/memories', {
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
      ? 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
      : 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)';
  };

  // User Selection Dialog
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
                <Person sx={{ fontSize: 50, color: '#fff' }} />
              </Box>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#2d3748' }}>
                Who's Creating This Memory?
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                Choose who you are to continue
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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

            <Button
              variant="outlined"
              onClick={() => navigate('/')}
              sx={{ 
                mt: 3,
                borderRadius: 2,
                borderColor: 'rgba(102, 126, 234, 0.3)',
                color: '#667eea',
                '&:hover': {
                  borderColor: '#667eea',
                  background: 'rgba(102, 126, 234, 0.1)'
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
      background: 'linear-gradient(135deg, #f8f9ff 0%, #e8f4fd 100%)',
      py: 3
    }}>
      <Container maxWidth="md">
        <Paper 
          elevation={0}
          sx={{ 
            p: 4,
            borderRadius: 4,
            background: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <IconButton 
              onClick={() => navigate('/')} 
              sx={{ 
                mr: 2,
                background: 'rgba(102, 126, 234, 0.1)',
                '&:hover': {
                  background: 'rgba(102, 126, 234, 0.2)'
                }
              }}
            >
              <ArrowBack />
            </IconButton>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: '#2d3748' }}>
              Create New Memory
            </Typography>
            <Box sx={{ ml: 'auto' }}>
              <Chip 
                label={`Created by ${getUserName(selectedUser)}`}
                sx={{
                  background: getUserColor(selectedUser),
                  color: '#fff',
                  fontWeight: 600
                }}
              />
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Title */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Memory Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Add sx={{ color: '#667eea' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '& fieldset': {
                        borderColor: 'rgba(102, 126, 234, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(102, 126, 234, 0.4)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                      },
                    },
                  }}
                />
              </Grid>

              {/* Date and Location */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday sx={{ color: '#667eea' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '& fieldset': {
                        borderColor: 'rgba(102, 126, 234, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(102, 126, 234, 0.4)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  variant="outlined"
                  placeholder="Where did this happen?"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn sx={{ color: '#667eea' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '& fieldset': {
                        borderColor: 'rgba(102, 126, 234, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(102, 126, 234, 0.4)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                      },
                    },
                  }}
                />
              </Grid>

              {/* Notes */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  variant="outlined"
                  placeholder="Write about your special moment..."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '& fieldset': {
                        borderColor: 'rgba(102, 126, 234, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(102, 126, 234, 0.4)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                      },
                    },
                  }}
                />
              </Grid>

              {/* Image Upload */}
              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#2d3748' }}>
                    Add Photos
                  </Typography>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="image-upload"
                    multiple
                    type="file"
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="image-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<CloudUpload />}
                      sx={{ 
                        mb: 2,
                        borderRadius: 2,
                        borderColor: 'rgba(102, 126, 234, 0.3)',
                        color: '#667eea',
                        '&:hover': {
                          borderColor: '#667eea',
                          background: 'rgba(102, 126, 234, 0.1)'
                        }
                      }}
                    >
                      Choose Images
                    </Button>
                  </label>
                </Box>

                {/* Image Preview */}
                <Grid container spacing={2}>
                  {formData.images.map((image, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card sx={{ 
                        position: 'relative',
                        borderRadius: 2,
                        overflow: 'hidden'
                      }}>
                        <CardMedia
                          component="img"
                          height="150"
                          image={image.preview}
                          alt={image.name}
                          sx={{ objectFit: 'cover' }}
                        />
                        <IconButton
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            '&:hover': {
                              backgroundColor: 'rgba(255,255,255,1)'
                            }
                          }}
                          onClick={() => removeImage(index)}
                        >
                          <Delete color="error" />
                        </IconButton>
                        <Box sx={{ p: 1 }}>
                          <Typography variant="caption" noWrap sx={{ color: '#2d3748' }}>
                            {image.name}
                          </Typography>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/')}
                    disabled={uploading}
                    sx={{
                      borderRadius: 2,
                      borderColor: 'rgba(102, 126, 234, 0.3)',
                      color: '#667eea',
                      '&:hover': {
                        borderColor: '#667eea',
                        background: 'rgba(102, 126, 234, 0.1)'
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={uploading ? <CircularProgress size={20} /> : <Save />}
                    disabled={uploading || !formData.title}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: 2,
                      textTransform: 'none',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)'
                      }
                    }}
                  >
                    {uploading ? 'Creating...' : 'Save Memory'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default CreateMemory; 