const mongoose = require("mongoose");

const formation = new mongoose.Schema({
  theme: { type: String, required: true },
  modeFormation: {
      type: String,
      enum: ['En ligne', 'Présentiel'],
      required: true,
    },
      numSalle: {
      type: Number,
      required: function() {
        return this.modeFormation === 'Présentiel';  
      },
    },
    creditImpot: { type: Boolean, default: false },
    droitIndividuel: { type: Boolean, default: false },
    droitCollectif: { type: Boolean, default: false },
    periodeDu: { type: Date, required: true },
    periodeA: { type: Date, required: true },
    horaireDu: { type: String, required: true },
    horaireA: { type: String, required: true },
    status: { type: String, enum: ['Validée', 'Refusée', 'En Attente'], default: 'En Attente' },
    
});

module.exports = mongoose.model("Formation", formation);
