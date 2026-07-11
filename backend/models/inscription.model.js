const mongoose = require("mongoose");

const inscriptionSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    
    entreprise: {
      type: String,
      required: [true, "Entreprise is required"],
      trim: true,
    },

    service: {
      type: String,
      required: [true, "Service is required"],
      trim: true,
    },
    
    participantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Participant",
      required: true,
    },
    
    formationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Formation",
      required: true,
    },
    
    formationSnapshot: {
      theme: { type: String },
      modeFormation: { type: String },
      numSalle: { type: Number },
      periodeDu: { type: Date },
      periodeA: { type: Date },
      horaireDu: { type: String },
      horaireA: { type: String },
    },

    status: {
      type: String,
      enum: ["Validée", "Refusée", "En Attente"],
      default: "En Attente",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

inscriptionSchema.index(
  { participantId: 1, formationId: 1 },
  { unique: true }
);

module.exports = mongoose.model("Inscription", inscriptionSchema);