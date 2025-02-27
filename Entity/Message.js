const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    received: {
        type: Boolean,
        default: false
    },
    seen: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Create the Message model
const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
