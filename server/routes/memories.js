const express = require('express');
const Memory = require('../models/Memory');

const router = express.Router();

// Get all memories
router.get('/', async (req, res) => {
  try {
    const memories = await Memory.find().sort({ date: -1 });
    res.json(memories);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new memory
router.post('/', async (req, res) => {
  try {
    const { title, date, location, notes, images, creator } = req.body;

    const memory = new Memory({
      title,
      date,
      location,
      notes,
      images,
      creator
    });

    await memory.save();
    res.status(201).json(memory);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
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
    res.status(500).json({ message: 'Server error' });
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
    res.status(500).json({ message: 'Server error' });
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
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 