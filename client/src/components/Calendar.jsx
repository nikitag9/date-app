import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
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
  Alert,
  CircularProgress,
  TextField
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  ArrowBack,
  Favorite,
  LocationOn,
  CalendarToday,
  Send
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Calendar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [memories, setMemories] = useState([]);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  useEffect(() => {
    fetchMemories();
  }, [currentMonth]);

  const fetchMemories = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('http://localhost:5001/api/memories');
      if (response.ok) {
        const data = await response.json();
        setMemories(data);
      } else {
        setError('Failed to fetch memories');
      }
    } catch (error) {
      console.error('Error fetching memories:', error);
      setError('Error loading memories');
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

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getMemoriesForDate = (date) => {
    if (!date) return [];
    return memories.filter(memory => {
      const memoryDate = new Date(memory.date);
      return memoryDate.toDateString() === date.toDateString();
    });
  };

  const isToday = (date) => {
    if (!date) return false;
    return date.toDateString() === new Date().toDateString();
  };

  const isCurrentMonth = (date) => {
    if (!date) return false;
    return date.getMonth() === currentMonth.getMonth();
  };

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

  const changeMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  const getCreatorColor = (creator) => {
    return creator === 'niki' 
      ? 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
      : 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)';
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
          <Typography variant="h6" color="text.secondary">Loading calendar...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8f9ff 0%, #e8f4fd 100%)',
      py: 3
    }}>
      <Container maxWidth="lg">
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
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
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
              Calendar View
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* Month Navigation */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
            <IconButton onClick={() => changeMonth(-1)} sx={{ color: '#667eea' }}>
              <ChevronLeft />
            </IconButton>
            <Typography variant="h5" sx={{ mx: 3, fontWeight: 600, color: '#2d3748' }}>
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </Typography>
            <IconButton onClick={() => changeMonth(1)} sx={{ color: '#667eea' }}>
              <ChevronRight />
            </IconButton>
          </Box>

          {/* Calendar Grid */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            gap: 1, 
            mb: 3, 
            border: '1px solid rgba(102, 126, 234, 0.2)', 
            borderRadius: 2, 
            overflow: 'hidden' 
          }}>
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <Box key={day} sx={{ 
                p: 2, 
                textAlign: 'center', 
                background: 'rgba(102, 126, 234, 0.1)',
                borderBottom: '1px solid rgba(102, 126, 234, 0.2)',
                fontWeight: 600,
                color: '#2d3748'
              }}>
                {day}
              </Box>
            ))}

            {/* Calendar days */}
            {getDaysInMonth(currentMonth).map((date, index) => {
              const dayMemories = getMemoriesForDate(date);
              const isTodayDate = isToday(date);
              const isCurrentMonthDate = isCurrentMonth(date);

              return (
                <Box
                  key={index}
                  sx={{
                    minHeight: 120,
                    p: 1,
                    border: '1px solid rgba(102, 126, 234, 0.1)',
                    background: isTodayDate 
                      ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
                      : 'transparent',
                    position: 'relative'
                  }}
                >
                  {date && (
                    <>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: isTodayDate ? 700 : 500,
                          color: isCurrentMonthDate ? '#2d3748' : '#a0aec0',
                          mb: 1
                        }}
                      >
                        {date.getDate()}
                      </Typography>
                      
                      {/* Memory chips */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        {dayMemories.slice(0, 2).map((memory, memoryIndex) => (
                          <Chip
                            key={memory._id}
                            label={memory.title}
                            size="small"
                            onClick={() => handleMemoryClick(memory)}
                            sx={{
                              background: getCreatorColor(memory.creator),
                              color: '#fff',
                              fontSize: '0.7rem',
                              height: 20,
                              cursor: 'pointer',
                              '&:hover': {
                                opacity: 0.8
                              }
                            }}
                          />
                        ))}
                        {dayMemories.length > 2 && (
                          <Chip
                            label={`+${dayMemories.length - 2} more`}
                            size="small"
                            sx={{
                              background: 'rgba(102, 126, 234, 0.2)',
                              color: '#667eea',
                              fontSize: '0.7rem',
                              height: 20
                            }}
                          />
                        )}
                      </Box>
                    </>
                  )}
                </Box>
              );
            })}
          </Box>

          {/* Month Summary */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#2d3748', mb: 3 }}>
              Memories This Month
            </Typography>
            {memories.filter(memory => {
              const memoryDate = new Date(memory.date);
              return memoryDate.getMonth() === currentMonth.getMonth() && 
                     memoryDate.getFullYear() === currentMonth.getFullYear();
            }).length > 0 ? (
              <Grid container spacing={2}>
                {memories.filter(memory => {
                  const memoryDate = new Date(memory.date);
                  return memoryDate.getMonth() === currentMonth.getMonth() && 
                         memoryDate.getFullYear() === currentMonth.getFullYear();
                }).map(memory => (
                  <Grid item xs={12} sm={6} md={4} key={memory._id}>
                    <Card 
                      onClick={() => handleMemoryClick(memory)}
                      sx={{ 
                        cursor: 'pointer',
                        borderRadius: 3,
                        overflow: 'hidden',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                        }
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="150"
                        image={getImageUrl(memory)}
                        alt={memory.title}
                        sx={{ objectFit: 'cover' }}
                      />
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748' }}>
                            {memory.title}
                          </Typography>
                          <Chip
                            label={memory.creator === 'niki' ? 'Niki' : 'Amish'}
                            size="small"
                            sx={{
                              background: getCreatorColor(memory.creator),
                              color: '#fff',
                              fontWeight: 600
                            }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {new Date(memory.date).toLocaleDateString()}
                        </Typography>
                        {memory.location && (
                          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                            <LocationOn sx={{ fontSize: 16, mr: 0.5, color: '#667eea' }} />
                            {memory.location}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No memories this month
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => navigate('/create-memory')}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 2,
                    textTransform: 'none'
                  }}
                >
                  Create Memory
                </Button>
              </Box>
            )}
          </Box>
        </Paper>

        {/* Memory Detail Dialog */}
        <Dialog 
          open={!!selectedMemory} 
          onClose={handleCloseDialog} 
          maxWidth="md" 
          fullWidth 
          PaperProps={{ 
            sx: { 
              borderRadius: 3, 
              background: 'rgba(255,255,255,0.95)', 
              backdropFilter: 'blur(10px)' 
            } 
          }}
        >
          {selectedMemory && (
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <CardMedia
                    component="img"
                    height="250"
                    image={getImageUrl(selectedMemory)}
                    alt={selectedMemory.title}
                    sx={{ objectFit: 'cover', borderRadius: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#2d3748' }}>
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
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <CalendarToday sx={{ mr: 1, color: '#667eea' }} />
                    {new Date(selectedMemory.date).toLocaleDateString()}
                  </Typography>
                  {selectedMemory.location && (
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                      <LocationOn sx={{ mr: 1, color: '#667eea' }} />
                      {selectedMemory.location}
                    </Typography>
                  )}
                  
                  {/* Notes Section */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 1 }}>
                      Notes & Comments
                    </Typography>
                    {selectedMemory.notes ? (
                      <Typography variant="body1" sx={{ color: '#2d3748', lineHeight: 1.6, mb: 2 }}>
                        {selectedMemory.notes}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        No notes yet. Be the first to add one!
                      </Typography>
                    )}
                    
                    {/* Add Note Section */}
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#2d3748', mb: 1 }}>
                        Add a note as {user?.name || 'User'}:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
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
                                borderColor: 'rgba(102, 126, 234, 0.2)',
                              },
                            },
                          }}
                        />
                        <Button
                          variant="contained"
                          onClick={handleAddNote}
                          disabled={!newNote.trim() || addingNote}
                          sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: 2,
                            textTransform: 'none',
                            minWidth: 'auto',
                            px: 2
                          }}
                        >
                          {addingNote ? <CircularProgress size={20} /> : <Send />}
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                  
                  {/* View Full Memory Button */}
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => {
                      handleCloseDialog();
                      navigate('/gallery');
                    }}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: 2,
                      textTransform: 'none',
                      mt: 2
                    }}
                  >
                    View Full Memory in Gallery
                  </Button>
                </Grid>
              </Grid>
            </DialogContent>
          )}
        </Dialog>
      </Container>
    </Box>
  );
};

export default Calendar; 