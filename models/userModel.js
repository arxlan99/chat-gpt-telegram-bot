const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  model: {
    type: String,
    required: true,
    default: 'gpt-3.5-turbo',
  },
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  apiKey: {
    type: String,
    required: true,
  },
  modelContent: {
    type: String,
    required: false,
    default: 'You are a helpful assistant.',
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
