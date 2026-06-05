const mongoose = require("mongoose");

const admin = mongoose.model('admin', {
    fullname: {
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
        enum: ['admin'], 
        default: 'admin'
    },
});

module.exports = admin;
