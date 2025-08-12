import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Box, Grid, Card, CardContent, CardMedia, IconButton, Chip, Dialog, DialogContent, Button, Alert, CircularProgress, TextField, MobileStepper } from '@mui/material';
import { ChevronLeft, ChevronRight, ArrowBack, Favorite, LocationOn, CalendarToday, Send, KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
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
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => { fetchMemories(); }, [currentMonth]);

  const fetchMemories = async () => {
    try {
      setLoading(true); setError('');
      const response = await fetch('http://localhost:5001/api/memories');
      if (response.ok) { const data = await response.json(); setMemories(data); } else { setError('Failed to fetch memories'); }
    } catch (error) { console.error('Error fetching memories:', error); setError('Error loading memories'); } finally { setLoading(false); }
  };

  const getImageUrl = (memory) => {
    if (memory.images && memory.images.length > 0) {
      const imagePath = memory.images[0];
      if (imagePath.startsWith('http')) { return imagePath; }
      if (imagePath.startsWith('/uploads/')) { return `http://localhost:5001${imagePath}`; }
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
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getMemoriesForDate = (date) => {
    if (!date) return [];
    return memories.filter(memory => {
      const memoryDate = new Date(memory.date);
      return memoryDate.getDate() === date.getDate() && 
             memoryDate.getMonth() === date.getMonth() && 
             memoryDate.getFullYear() === date.getFullYear();
    });
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  const isCurrentMonth = (date) => {
    if (!date) return false;
    return date.getMonth() === currentMonth.getMonth() && 
           date.getFullYear() === currentMonth.getFullYear();
  };

  const handleMemoryClick = (memory) => { setSelectedMemory(memory); };
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

  const changeMonth = (offset) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + offset);
      return newDate;
    });
  };

  const handleMonthYearClick = () => {
    setShowDatePicker(true);
  };

  const handleDatePickerChange = (event) => {
    const newDate = new Date(event.target.value);
    setCurrentMonth(newDate);
    setShowDatePicker(false);
  };

  const getCreatorColor = (creator) => {
    return creator === 'niki' ? 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' : 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)';
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8f9ff 0%, #e8f4fd 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={60} sx={{ color: '#667eea' }} />
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
              Calendar View
            </Typography>
          </Box>
          {error && (<Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>{error}</Alert>)}
          
          {/* Month/Year Navigation */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            mb: { xs: 3, md: 4 },
            background: 'rgba(255,255,255,0.8)',
            borderRadius: 3,
            p: { xs: 2, md: 3 },
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
          }}>
            <IconButton onClick={() => changeMonth(-1)} sx={{ 
              color: '#FF6B6B',
              background: 'rgba(255,107,107,0.1)',
              '&:hover': { background: 'rgba(255,107,107,0.2)' }
            }}>
              <ChevronLeft />
            </IconButton>
            <Button
              onClick={handleMonthYearClick}
              sx={{ 
                mx: 3, 
                fontWeight: 600, 
                color: '#2D3748',
                fontSize: { xs: '1.1rem', md: '1.5rem' },
                textTransform: 'none',
                background: 'rgba(255,107,107,0.05)',
                borderRadius: 2,
                px: 3,
                '&:hover': { 
                  background: 'rgba(255,107,107,0.1)',
                  transform: 'scale(1.02)'
                } 
              }}
            >
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </Button>
            <IconButton onClick={() => changeMonth(1)} sx={{ 
              color: '#FF6B6B',
              background: 'rgba(255,107,107,0.1)',
              '&:hover': { background: 'rgba(255,107,107,0.2)' }
            }}>
              <ChevronRight />
            </IconButton>
          </Box>

          {/* Date Picker Dialog */}
          <Dialog open={showDatePicker} onClose={() => setShowDatePicker(false)} maxWidth="xs" fullWidth>
            <DialogContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ mb: 3, textAlign: 'center', fontWeight: 600, color: '#2D3748' }}>
                Select Month & Year
              </Typography>
              <TextField
                type="month"
                fullWidth
                value={`${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`}
                onChange={handleDatePickerChange}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 3 }}
              />
              <Button
                fullWidth
                variant="contained"
                onClick={() => setShowDatePicker(false)}
                sx={{ 
                  background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
                  borderRadius: 3,
                  py: 1.5
                }}
              >
                Close
              </Button>
            </DialogContent>
          </Dialog>

          {/* Calendar Grid */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            gap: { xs: 1, md: 1.5 }, 
            mb: 4, 
            border: '2px solid rgba(255,107,107,0.2)', 
            borderRadius: 3, 
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.6)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
          }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <Box key={day} sx={{ 
                p: { xs: 1.5, md: 2 }, 
                textAlign: 'center', 
                background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)', 
                borderBottom: '2px solid rgba(255,107,107,0.2)', 
                fontWeight: 700, 
                color: '#fff',
                fontSize: { xs: '0.75rem', md: '0.875rem' },
                textShadow: '0 1px 2px rgba(0,0,0,0.1)'
              }}>
                {day}
              </Box>
            ))}
            {getDaysInMonth(currentMonth).map((date, index) => {
              const dayMemories = getMemoriesForDate(date);
              const isTodayDate = isToday(date);
              const isCurrentMonthDate = isCurrentMonth(date);
              return (
                <Box key={index} sx={{ 
                  minHeight: { xs: 80, md: 100 }, 
                  p: { xs: 1, md: 1.5 }, 
                  border: '1px solid rgba(255,107,107,0.1)', 
                  background: isTodayDate 
                    ? 'linear-gradient(135deg, rgba(255,107,107,0.15) 0%, rgba(255,142,142,0.15) 100%)' 
                    : 'transparent', 
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'rgba(255,107,107,0.05)',
                    transform: 'scale(1.02)'
                  }
                }}>
                  {date && (
                    <>
                      <Typography variant="body2" sx={{ 
                        fontWeight: isTodayDate ? 800 : 600, 
                        color: isCurrentMonthDate ? '#2D3748' : '#A0AEC0', 
                        mb: 1,
                        fontSize: { xs: '0.875rem', md: '1rem' },
                        textAlign: 'center'
                      }}>
                        {date.getDate()}
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        {dayMemories.slice(0, 2).map((memory) => (
                          <Chip 
                            key={memory._id} 
                            label={memory.title} 
                            size="small" 
                            onClick={() => handleMemoryClick(memory)} 
                            sx={{ 
                              background: getCreatorColor(memory.creator), 
                              color: '#fff', 
                              fontSize: { xs: '0.6rem', md: '0.7rem' }, 
                              height: { xs: 18, md: 22 }, 
                              cursor: 'pointer', 
                              fontWeight: 600,
                              '&:hover': { 
                                opacity: 0.8,
                                transform: 'scale(1.05)'
                              } 
                            }} 
                          />
                        ))}
                        {dayMemories.length > 2 && (
                          <Chip 
                            label={`+${dayMemories.length - 2} more`} 
                            size="small" 
                            sx={{ 
                              background: 'rgba(255,107,107,0.2)', 
                              color: '#FF6B6B', 
                              fontSize: { xs: '0.6rem', md: '0.7rem' }, 
                              height: { xs: 18, md: 22 },
                              fontWeight: 600
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

          {/* Memories This Month Section */}
          <Box sx={{ mt: 5 }}>
            <Typography variant="h5" gutterBottom sx={{ 
              fontWeight: 600, 
              color: '#2D3748', 
              mb: 3, 
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              textAlign: 'center'
            }}>
              Memories This Month
            </Typography>
            {memories.filter(memory => { 
              const memoryDate = new Date(memory.date); 
              return memoryDate.getMonth() === currentMonth.getMonth() && memoryDate.getFullYear() === currentMonth.getFullYear(); 
            }).length > 0 ? (
              <Grid container spacing={{ xs: 2, md: 3 }}>
                {memories.filter(memory => { 
                  const memoryDate = new Date(memory.date); 
                  return memoryDate.getMonth() === currentMonth.getMonth() && memoryDate.getFullYear() === currentMonth.getFullYear(); 
                }).map(memory => (
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
                      <CardMedia component="img" height={{ xs: 140, md: 160 }} image={getImageUrl(memory)} alt={memory.title} sx={{ objectFit: 'cover' }} />
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
              <Box sx={{ 
                textAlign: 'center', 
                py: { xs: 6, md: 8 },
                background: 'rgba(255,255,255,0.6)',
                borderRadius: 3,
                border: '2px dashed rgba(255,107,107,0.3)'
              }}>
                <Typography variant="h6" color="text.secondary" gutterBottom sx={{ 
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                  color: '#718096',
                  mb: 2
                }}>
                  No memories this month
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => navigate('/create-memory')}
                  sx={{ 
                    background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
                    borderRadius: 3,
                    px: 4,
                    py: 1.5
                  }}
                >
                  Create Memory
                </Button>
              </Box>
            )}
          </Box>
        </Paper>

        {/* Memory Detail Dialog */}
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
                  <CardMedia component="img" height={{ xs: 250, md: 300 }} image={getImageUrl(selectedMemory)} alt={selectedMemory.title} sx={{ objectFit: 'cover', borderRadius: 3 }} />
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
                        p: 2,
                        borderRadius: 2,
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

                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => {
                      handleCloseDialog();
                      navigate('/gallery');
                    }}
                    sx={{
                      background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
                      borderRadius: 3,
                      textTransform: 'none',
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600
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