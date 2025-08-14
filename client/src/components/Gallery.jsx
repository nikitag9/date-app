import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Dialog,
  DialogContent,
  Chip,
  Button,
  Tabs,
  Tab,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Alert,
  CircularProgress,
  InputAdornment,
  Divider
} from '@mui/material';
import {
  Search,
  ViewModule,
  ViewList,
  ArrowBack,
  LocationOn,
  CalendarToday,
  Favorite,
  Add,
  Send,
  GridOn
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Gallery = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [memories, setMemories] = useState([]);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const response = await fetch(`${API_URL}/api/memories`);
      if (response.ok) {
        const data = await response.json();
        setMemories(data);
        console.log('Memories fetched successfully:', data);
      } else {
        console.error('Failed to fetch memories:', response.status, response.statusText);
        setError('Failed to load memories. Please check if the backend server is running.');
      }
    } catch (error) {
      console.error('Error fetching memories:', error);
      setError('Cannot connect to server. Please ensure the backend server is running on port 5001.');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    if (imagePath.startsWith('/uploads/')) { return `${API_URL}${imagePath}`; }
    return `${API_URL}/uploads/${imagePath}`;
  };

  const getCreatorColor = (creator) => {
    return creator === 'niki' 
      ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' 
      : 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)';
  };

  const filteredMemories = memories.filter(memory => {
    const matchesSearch = memory.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (memory.location && memory.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (memory.notes && memory.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Just return all memories that match the search - no creator filtering
    return matchesSearch;
  });

  const handleMemoryClick = (memory) => {
    setSelectedMemory(memory);
  };

  const handleCloseDialog = () => {
    setSelectedMemory(null);
    setNewNote('');
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !selectedMemory) return;
    
    setAddingNote(true);
    try {
      const updatedMemory = {
        ...selectedMemory,
        notes: selectedMemory.notes 
          ? `${selectedMemory.notes}\n\n${user?.name || 'User'}: ${newNote}`
          : `${user?.name || 'User'}: ${newNote}`
      };

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const response = await fetch(`${API_URL}/api/memories/${selectedMemory._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedMemory)
      });

      if (response.ok) {
        // Update local state
        setMemories(prev => prev.map(m => 
          m._id === selectedMemory._id ? updatedMemory : m
        ));
        setSelectedMemory(updatedMemory);
        setNewNote('');
      }
    } catch (error) {
      console.error('Error adding note:', error);
    } finally {
      setAddingNote(false);
    }
  };

  const handleViewModeChange = (event, newValue) => {
    setViewMode(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <CircularProgress size={60} sx={{ color: '#6366F1' }} />
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
      <Container maxWidth="lg">
        <Paper elevation={0} sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          background: 'rgba(30,41,59,0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(99,102,241,0.3)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.4)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 3, md: 4 } }}>
            <IconButton onClick={() => navigate('/')} sx={{
              mr: 2,
              background: 'rgba(99,102,241,0.1)',
              color: '#6366F1',
              '&:hover': { background: 'rgba(99,102,241,0.2)' }
            }}>
              <ArrowBack sx={{ fontSize: { xs: 20, md: 24 } }} />
            </IconButton>
            <Typography variant="h4" component="h1" sx={{
              fontWeight: 700,
              color: '#F8FAFC',
              fontSize: { xs: '1.5rem', md: '2.125rem' }
            }}>
              Memory Gallery
            </Typography>
          </Box>
          <Box sx={{ mb: { xs: 3, md: 4 } }}>
            <Grid container spacing={{ xs: 2, md: 3 }} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Search memories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  variant="outlined"
                  InputProps={{ startAdornment: (<InputAdornment position="start"><Search sx={{ color: '#6366F1' }} /></InputAdornment>) }}
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
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{
                  display: 'flex',
                  gap: 2,
                  justifyContent: { xs: 'center', md: 'flex-end' },
                  flexWrap: 'wrap'
                }}>
                  <Tabs
                    value={viewMode}
                    onChange={handleViewModeChange}
                    aria-label="view mode"
                    sx={{
                      '& .MuiTab-root': {
                        minWidth: 'auto',
                        textTransform: 'none',
                        color: '#6366F1',
                        '&.Mui-selected': { color: '#6366F1' }
                      },
                      '& .MuiTabs-indicator': { backgroundColor: '#6366F1' }
                    }}
                  >
                    <Tab icon={<GridOn />} value="grid" aria-label="grid view" />
                    <Tab icon={<ViewList />} value="list" aria-label="list view" />
                  </Tabs>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
              {error}
            </Alert>
          )}

          {filteredMemories.length > 0 ? (
            viewMode === 'grid' ? (
              <Grid container spacing={{ xs: 2, md: 3 }}>
                {filteredMemories.map((memory) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={memory._id}>
                    <Card onClick={() => handleMemoryClick(memory)} sx={{
                      cursor: 'pointer',
                      borderRadius: 3,
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      height: '100%',
                      background: 'rgba(30,41,59,0.8)',
                      border: '1px solid rgba(99,102,241,0.2)',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
                        border: '1px solid rgba(99,102,241,0.4)'
                      }
                    }}>
                      <CardMedia 
                        component="img" 
                        height={200} 
                        image={getImageUrl(memory.images?.[0])} 
                        alt={memory.title} 
                        sx={{ objectFit: 'cover' }} 
                      />
                      <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                          <Typography variant="h6" sx={{
                            fontWeight: 600,
                            color: '#F8FAFC',
                            fontSize: { xs: '0.875rem', md: '1rem' },
                            lineHeight: 1.3,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }}>
                            {memory.title}
                          </Typography>
                          <Chip
                            label={memory.creator === 'niki' ? 'Niki' : 'Amish'}
                            size="small"
                            sx={{
                              background: getCreatorColor(memory.creator),
                              color: '#fff',
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              minWidth: 'auto',
                              height: 20
                            }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{
                          mb: 1.5,
                          fontSize: { xs: '0.75rem', md: '0.875rem' },
                          color: '#CBD5E1'
                        }}>
                          {new Date(memory.date).toLocaleDateString()}
                        </Typography>
                        {memory.location && (
                          <Typography variant="body2" color="text.secondary" sx={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: { xs: '0.75rem', md: '0.875rem' },
                            color: '#CBD5E1',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            <LocationOn sx={{ fontSize: { xs: 14, md: 16 }, mr: 0.5, color: '#6366F1', flexShrink: 0 }} />
                            {memory.location}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <ImageList cols={{ xs: 2, sm: 3, md: 4, lg: 5 }} gap={16} sx={{
                borderRadius: 3,
                overflow: 'hidden',
                margin: 0
              }}>
                {filteredMemories.map((memory) => (
                  <ImageListItem key={memory._id} onClick={() => handleMemoryClick(memory)} sx={{
                    cursor: 'pointer',
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
                    }
                  }}>
                    <img
                      src={getImageUrl(memory.images?.[0])}
                      alt={memory.title}
                      loading="lazy"
                      style={{
                        borderRadius: 12,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <ImageListItemBar
                      title={memory.title}
                      subtitle={
                        <Box>
                          <Typography variant="body2" sx={{
                            color: '#fff',
                            fontSize: '0.75rem',
                            mb: 0.5,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {new Date(memory.date).toLocaleDateString()}
                          </Typography>
                          <Chip
                            label={memory.creator === 'niki' ? 'Niki' : 'Amish'}
                            size="small"
                            sx={{
                              background: getCreatorColor(memory.creator),
                              color: '#fff',
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              height: 18
                            }}
                          />
                        </Box>
                      }
                      sx={{
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                        borderRadius: '0 0 12px 12px',
                        padding: { xs: 1, md: 1.5 }
                      }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            )
          ) : (
            <Box sx={{
              textAlign: 'center',
              py: { xs: 8, md: 10 },
              background: 'rgba(15,23,42,0.6)',
              borderRadius: 4,
              border: '2px dashed rgba(99,102,241,0.4)',
              mx: { xs: 1, md: 2 }
            }}>
              <Box sx={{
                width: { xs: 80, md: 100 },
                height: { xs: 80, md: 100 },
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
              <Typography variant="h5" gutterBottom sx={{
                fontWeight: 600,
                color: '#F8FAFC',
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                mb: 2
              }}>
                {searchTerm ? 'No memories found' : 'No Memories Yet'}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{
                mb: 4,
                fontSize: { xs: '0.875rem', md: '1rem' },
                color: '#CBD5E1',
                maxWidth: '500px',
                mx: 'auto'
              }}>
                {searchTerm ? 'Try adjusting your search or filters' : 'Create your first memory to start building your gallery!'}
              </Typography>
              {!searchTerm && (
                <Button
                  variant="contained"
                  onClick={() => navigate('/create-memory')}
                  sx={{
                    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600
                  }}
                >
                  Create Memory
                </Button>
              )}
            </Box>
          )}
        </Paper>
        <Dialog open={!!selectedMemory} onClose={handleCloseDialog} maxWidth="md" fullWidth PaperProps={{
          sx: {
            borderRadius: 4,
            background: 'rgba(30,41,59,0.95)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.4)'
          }
        }}>
          {selectedMemory && (
            <DialogContent sx={{ p: { xs: 3, md: 4 } }}>
              <Grid container spacing={{ xs: 2, md: 3 }}>
                <Grid item xs={12} md={6}>
                  <CardMedia component="img" height={{ xs: 280, md: 320 }} image={getImageUrl(selectedMemory.images?.[0])} alt={selectedMemory.title} sx={{ objectFit: 'cover', borderRadius: 3 }} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h4" sx={{
                      fontWeight: 700,
                      color: '#F8FAFC',
                      fontSize: { xs: '1.5rem', md: '2.125rem' }
                    }}>
                      {selectedMemory.title}
                    </Typography>
                    <Chip
                      label={`Created by ${selectedMemory.creator === 'niki' ? 'Niki' : 'Amish'}`}
                      sx={{
                        background: getCreatorColor(selectedMemory.creator),
                        color: '#fff',
                        fontWeight: 600
                      }}
                    />
                  </Box>
                  <Typography variant="body1" color="text.secondary" sx={{
                    mb: 2.5,
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '1rem',
                    color: '#CBD5E1'
                  }}>
                    <CalendarToday sx={{ mr: 1.5, color: '#6366F1' }} />
                    {new Date(selectedMemory.date).toLocaleDateString()}
                  </Typography>
                  {selectedMemory.location && (
                    <Typography variant="body1" color="text.secondary" sx={{
                      mb: 2.5,
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '1rem',
                      color: '#CBD5E1'
                    }}>
                      <LocationOn sx={{ mr: 1.5, color: '#6366F1' }} />
                      {selectedMemory.location}
                    </Typography>
                  )}

                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{
                      fontWeight: 600,
                      color: '#F8FAFC',
                      mb: 2,
                      fontSize: '1.25rem'
                    }}>
                      Notes & Comments
                    </Typography>
                    {selectedMemory.notes ? (
                      <Typography variant="body1" sx={{
                        color: '#F8FAFC',
                        lineHeight: 1.7,
                        mb: 3,
                        background: 'rgba(15,23,42,0.6)',
                        p: 2.5,
                        borderRadius: 3,
                        border: '1px solid rgba(99,102,241,0.2)'
                      }}>
                        {selectedMemory.notes}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{
                        mb: 3,
                        color: '#64748B',
                        fontStyle: 'italic'
                      }}>
                        No notes yet. Be the first to add one!
                      </Typography>
                    )}

                    <Box sx={{ mt: 3 }}>
                      <Typography variant="body2" sx={{
                        fontWeight: 600,
                        color: '#F8FAFC',
                        mb: 2,
                        fontSize: '1rem'
                      }}>
                        Add a note as {user?.name || 'User'}:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1.5 }}>
                        <TextField
                          fullWidth
                          multiline
                          rows={1}
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          placeholder="Add a new note..."
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              background: 'rgba(15,23,42,0.6)',
                              '& fieldset': {
                                borderColor: 'rgba(99,102,241,0.3)',
                              },
                            },
                          }}
                        />
                        <Button
                          variant="contained"
                          onClick={handleAddNote}
                          disabled={!newNote.trim() || addingNote}
                          sx={{
                            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                            borderRadius: 2,
                            textTransform: 'none',
                            minWidth: 'auto',
                            px: 2.5,
                            py: 1.5
                          }}
                        >
                          {addingNote ? <CircularProgress size={20} color="inherit" /> : <Send />}
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
          )}
        </Dialog>
      </Container>
    </Box>
  );
};

export default Gallery; 