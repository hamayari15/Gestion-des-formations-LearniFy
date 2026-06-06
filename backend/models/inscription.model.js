const mongoose = require("mongoose");

const inscriptionSchema = new mongoose.Schema({
    theme: {
        type: String,
        required: true 
    },
    numSalle: {
        type: String,
        required : true
    },
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true 
    },
    entreprise: {
        type: String, 
        required: true
    },
    service: {
        type: String,
        required: true
    },
    participantId: {
        type: String
    },
    formationId: {
        type : String
    },
    status: { type: String, enum: ['Validée', 'Refusée', 'En Attente'], default: 'En Attente' },
    
}, { timestamps: true });

module.exports = mongoose.model('Inscription', inscriptionSchema);
