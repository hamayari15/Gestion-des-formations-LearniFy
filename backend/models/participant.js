const mongoose = require("mongoose");

const participant = mongoose.model('participant', {
    fullname: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true 
    },
    gender: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true 
    },
    password: {
        type: String,
        required: true 
    },
    profile: {
        type: String,
        enum: ['user'],
        default: 'user' 
    }
});

module.exports = participant;
