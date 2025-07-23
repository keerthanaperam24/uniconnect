const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['housing', 'book', 'item'], required: true },
  title: { type: String, required: true },
  description: String,
  price: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', postSchema);