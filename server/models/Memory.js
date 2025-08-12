const mongoose = require('mongoose');

const MemorySchema = new mongoose.Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  creator: { type: String, required: true }, // 'niki' or 'amish'
  date: { type: Date, required: true },
  title: { type: String, required: true },
  location: { type: String },
  notes: { type: String },
  images: [{ type: String }], // image file paths or URLs
}, {
  timestamps: true
});

module.exports = mongoose.model('Memory', MemorySchema); 