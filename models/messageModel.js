const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  message: [
    {
      role: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      _id: false,
    },
  ],
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
