const mongoose = require('mongoose');
const Message = require('./Message'); // Ensure correct path

const chatSchema = new mongoose.Schema({
    chatId: {
        type: String,
        required: true,
        unique: true
    },
    chat1: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }],
    chat2: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }],
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

// Create the Chat model
const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
