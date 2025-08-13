const express = require('express');
const upload = require('../middleware/upload');

const router = express.Router();

// Upload single image
router.post('/single', upload.single('image'), (req, res) => {
  try {
    console.log('Single image upload request:', req.file);
    
    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    console.log('Image uploaded successfully:', imageUrl);
    
    res.json({
      message: 'Image uploaded successfully',
      imageUrl: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

// Upload multiple images
router.post('/multiple', upload.array('images', 10), (req, res) => {
  try {
    console.log('Multiple images upload request:', req.files);
    
    if (!req.files || req.files.length === 0) {
      console.log('No files uploaded');
      return res.status(400).json({ message: 'No images uploaded' });
    }

    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
    console.log('Images uploaded successfully:', imageUrls);
    
    res.json({
      message: 'Images uploaded successfully',
      imageUrls: imageUrls,
      filenames: req.files.map(file => file.filename)
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

module.exports = router; 