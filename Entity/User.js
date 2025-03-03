const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false
    },
    description: {
        type: String,
        default: ""
    },
    chatlist: [{
        type: String,
        default: []
    }],
    blacklist: [{
        type: String,
        default: []
    }],
    friendlist: [{
        type: String,
        default: []
    }],
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
