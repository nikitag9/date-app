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
  Send
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Gallery = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [memories, setMemories] = useState([]);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/memories');
      if (response.ok) {
        const data = await response.json();
        setMemories(data);
      }
    } catch (error) {
      console.error('Error fetching memories:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (memory) => {
    if (memory.images && memory.images.length > 0) {
      const imagePath = memory.images[0];
      if (imagePath.startsWith('http')) {
        return imagePath;
      }
      // Fix the image path construction
      if (imagePath.startsWith('/uploads/')) {
        return `http://localhost:5001${imagePath}`;
      }
      return `http://localhost:5001/uploads/${imagePath}`;
    }
    return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop';
  };

  const getCreatorColor = (creator) => {
    return creator === 'niki' 
      ? 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
      : 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)';
  };

  const filteredMemories = memories.filter(memory => {
    const matchesSearch = memory.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (memory.location && memory.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (memory.notes && memory.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'niki' && memory.creator === 'niki') ||
                         (filter === 'amish' && memory.creator === 'amish');
    
    return matchesSearch && matchesFilter;
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

      const response = await fetch(`http://localhost:5001/api/memories/${selectedMemory._id}`, {
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

  const handleFilterChange = (event, newValue) => {
    setFilter(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8f9ff 0%, #e8f4fd 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress sx={{ color: '#667eea', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">Loading memories...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #FFF8F0 0%, #FFE8D6 100%)', 
      py: { xs: 2, md: 3 },
      px: 2
    }}>
      <Container maxWidth="lg">
        <Paper elevation={0} sx={{ 
          p: { xs: 3, md: 4 }, 
          borderRadius: 4, 
          background: 'rgba(255,255,255,0.9)', 
          backdropFilter: 'blur(20px)', 
          border: '1px solid rgba(255,255,255,0.8)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.08)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 3, md: 4 } }}>
            <IconButton onClick={() => navigate('/')} sx={{ 
              mr: 2, 
              background: 'rgba(255,107,107,0.1)', 
              color: '#FF6B6B',
              '&:hover': { background: 'rgba(255,107,107,0.2)' } 
            }}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h4" component="h1" sx={{ 
              fontWeight: 700, 
              color: '#2D3748', 
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
                  InputProps={{ startAdornment: (<InputAdornment position="start"><Search sx={{ color: '#FF6B6B' }} /></InputAdornment>) }} 
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 3,
                      background: 'rgba(255,255,255,0.8)',
                      '& fieldset': { 
                        borderColor: 'rgba(255,107,107,0.2)',
                        borderWidth: 2
                      }, 
                      '&:hover fieldset': { 
                        borderColor: 'rgba(255,107,107,0.4)' 
                      }, 
                      '&.Mui-focused fieldset': { 
                        borderColor: '#FF6B6B' 
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
                    value={filter} 
                    onChange={handleFilterChange} 
                    sx={{ 
                      '& .MuiTab-root': { 
                        textTransform: 'none', 
                        fontWeight: 600, 
                        color: '#FF6B6B', 
                        fontSize: { xs: '0.875rem', md: '1rem' },
                        minHeight: { xs: 40, md: 48 },
                        '&.Mui-selected': { color: '#FF6B6B' } 
                      }, 
                      '& .MuiTabs-indicator': { backgroundColor: '#FF6B6B' } 
                    }}
                  >
                    <Tab label="All" value="all" />
                    <Tab label="Niki" value="niki" />
                    <Tab label="Amish" value="amish" />
                  </Tabs>
                  <Tabs 
                    value={viewMode} 
                    onChange={handleViewModeChange} 
                    sx={{ 
                      '& .MuiTab-root': { 
                        minWidth: 'auto', 
                        textTransform: 'none', 
                        color: '#FF6B6B', 
                        '&.Mui-selected': { color: '#FF6B6B' } 
                      }, 
                      '& .MuiTabs-indicator': { backgroundColor: '#FF6B6B' } 
                    }}
                  >
                    <Tab icon={<ViewList />} value="grid" />
                    <Tab icon={<ViewModule />} value="list" />
                  </Tabs>
                </Box>
              </Grid>
            </Grid>
          </Box>
          {filteredMemories.length > 0 ? (
            viewMode === 'grid' ? (
              <Grid container spacing={{ xs: 2, md: 3 }}>
                {filteredMemories.map((memory) => (
                  <Grid item xs={12} sm={6} md={4} key={memory._id}>
                    <Card onClick={() => handleMemoryClick(memory)} sx={{ 
                      cursor: 'pointer', 
                      borderRadius: 3, 
                      overflow: 'hidden', 
                      transition: 'all 0.3s ease', 
                      height: '100%',
                      '&:hover': { 
                        transform: 'translateY(-8px)', 
                        boxShadow: '0 16px 48px rgba(0,0,0,0.15)' 
                      } 
                    }}>
                      <CardMedia component="img" height={{ xs: 180, md: 200 }} image={getImageUrl(memory)} alt={memory.title} sx={{ objectFit: 'cover' }} />
                      <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                          <Typography variant="h6" sx={{ 
                            fontWeight: 600, 
                            color: '#2D3748', 
                            fontSize: { xs: '1rem', md: '1.125rem' } 
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
                              fontSize: '0.75rem'
                            }} 
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ 
                          mb: 1.5, 
                          fontSize: { xs: '0.75rem', md: '0.875rem' },
                          color: '#718096'
                        }}>
                          {new Date(memory.date).toLocaleDateString()}
                        </Typography>
                        {memory.location && (
                          <Typography variant="body2" color="text.secondary" sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            fontSize: { xs: '0.75rem', md: '0.875rem' },
                            color: '#718096'
                          }}>
                            <LocationOn sx={{ fontSize: { xs: 14, md: 16 }, mr: 0.5, color: '#FF6B6B' }} />
                            {memory.location}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <ImageList cols={{ xs: 2, sm: 3, md: 3 }} gap={{ xs: 12, md: 20 }} sx={{ 
                borderRadius: 3,
                overflow: 'hidden'
              }}>
                {filteredMemories.map((memory) => (
                  <ImageListItem key={memory._id} onClick={() => handleMemoryClick(memory)} sx={{ 
                    cursor: 'pointer',
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                    }
                  }}>
                    <img 
                      src={getImageUrl(memory)} 
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
                            fontSize: { xs: '0.75rem', md: '0.875rem' },
                            mb: 0.5
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
                              fontSize: '0.75rem'
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
              background: 'rgba(255,255,255,0.6)',
              borderRadius: 4,
              border: '2px dashed rgba(255,107,107,0.3)',
              mx: { xs: 1, md: 2 }
            }}>
              <Box sx={{ 
                width: { xs: 80, md: 100 }, 
                height: { xs: 80, md: 100 }, 
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
              <Typography variant="h5" gutterBottom sx={{ 
                fontWeight: 600, 
                color: '#2D3748', 
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                mb: 2
              }}>
                {searchTerm ? 'No memories found' : 'No Memories Yet'}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ 
                mb: 4, 
                fontSize: { xs: '0.875rem', md: '1rem' },
                color: '#718096',
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
                    background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
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
            background: 'rgba(255,255,255,0.95)', 
            backdropFilter: 'blur(20px)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.12)'
          } 
        }}>
          {selectedMemory && (
            <DialogContent sx={{ p: { xs: 3, md: 4 } }}>
              <Grid container spacing={{ xs: 2, md: 3 }}>
                <Grid item xs={12} md={6}>
                  <CardMedia component="img" height={{ xs: 280, md: 320 }} image={getImageUrl(selectedMemory)} alt={selectedMemory.title} sx={{ objectFit: 'cover', borderRadius: 3 }} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h4" sx={{ 
                      fontWeight: 700, 
                      color: '#2D3748', 
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
                    color: '#718096'
                  }}>
                    <CalendarToday sx={{ mr: 1.5, color: '#FF6B6B' }} />
                    {new Date(selectedMemory.date).toLocaleDateString()}
                  </Typography>
                  {selectedMemory.location && (
                    <Typography variant="body1" color="text.secondary" sx={{ 
                      mb: 2.5, 
                      display: 'flex', 
                      alignItems: 'center',
                      fontSize: '1rem',
                      color: '#718096'
                    }}>
                      <LocationOn sx={{ mr: 1.5, color: '#FF6B6B' }} />
                      {selectedMemory.location}
                    </Typography>
                  )}

                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 600, 
                      color: '#2D3748', 
                      mb: 2,
                      fontSize: '1.25rem'
                    }}>
                      Notes & Comments
                    </Typography>
                    {selectedMemory.notes ? (
                      <Typography variant="body1" sx={{ 
                        color: '#2D3748', 
                        lineHeight: 1.7, 
                        mb: 3,
                        background: 'rgba(255,248,240,0.8)',
                        p: 2.5,
                        borderRadius: 3,
                        border: '1px solid rgba(255,107,107,0.1)'
                      }}>
                        {selectedMemory.notes}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ 
                        mb: 3,
                        color: '#718096',
                        fontStyle: 'italic'
                      }}>
                        No notes yet. Be the first to add one!
                      </Typography>
                    )}

                    <Box sx={{ mt: 3 }}>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 600, 
                        color: '#2D3748', 
                        mb: 2,
                        fontSize: '1rem'
                      }}>
                        Add a note as {user?.name || 'User'}:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1.5 }}>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Add your thoughts..."
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              '& fieldset': {
                                borderColor: 'rgba(255,107,107,0.2)',
                              },
                            },
                          }}
                        />
                        <Button
                          variant="contained"
                          onClick={handleAddNote}
                          disabled={!newNote.trim() || addingNote}
                          sx={{
                            background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
                            borderRadius: 2,
                            textTransform: 'none',
                            minWidth: 'auto',
                            px: 2.5,
                            py: 1.5
                          }}
                        >
                          {addingNote ? <CircularProgress size={20} /> : <Send />}
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