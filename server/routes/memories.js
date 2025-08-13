const express = require('express');
const Memory = require('../models/Memory');

const router = express.Router();

// Get all memories
router.get('/', async (req, res) => {
  try {
    const memories = await Memory.find().sort({ date: -1 });
    console.log('Fetched memories:', memories.length);
    res.json(memories);
  } catch (error) {
    console.error('Error fetching memories:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new memory
router.post('/', async (req, res) => {
  try {
    console.log('Creating memory with data:', req.body);
    const { title, date, location, notes, images, creator } = req.body;

    // Validate required fields
    if (!title || !date || !creator) {
      return res.status(400).json({ 
        message: 'Missing required fields: title, date, and creator are required' 
      });
    }

    const memory = new Memory({
      title,
      date: new Date(date),
      location: location || '',
      notes: notes || '',
      images: images || [],
      creator
    });

    console.log('Memory object created:', memory);
    const savedMemory = await memory.save();
    console.log('Memory saved successfully:', savedMemory._id);
    
    res.status(201).json(savedMemory);
  } catch (error) {
    console.error('Error creating memory:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      details: error.errors || 'Unknown error'
    });
  }
});

// Get a specific memory
router.get('/:id', async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);
    if (!memory) {
      return res.status(404).json({ message: 'Memory not found' });
    }
    res.json(memory);
  } catch (error) {
    console.error('Error fetching memory:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a memory
router.put('/:id', async (req, res) => {
  try {
    const { title, date, location, notes, images } = req.body;
    
    const memory = await Memory.findByIdAndUpdate(
      req.params.id,
      { title, date, location, notes, images },
      { new: true }
    );
    
    if (!memory) {
      return res.status(404).json({ message: 'Memory not found' });
    }
    
    res.json(memory);
  } catch (error) {
    console.error('Error updating memory:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a memory
router.delete('/:id', async (req, res) => {
  try {
    const memory = await Memory.findByIdAndDelete(req.params.id);
    if (!memory) {
      return res.status(404).json({ message: 'Memory not found' });
    }
    res.json({ message: 'Memory deleted' });
  } catch (error) {
    console.error('Error deleting memory:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router; 