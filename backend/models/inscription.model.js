const mongoose = require("mongoose");

const inscriptionSchema = new mongoose.Schema(
  {
    theme: {
      type: String,
      required: [true, "Theme is required"],
      trim: true,
    },

    numSalle: {
      type: String,
      required: [true, "Room number is required"],
    },

    fullname: {
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
      type: String,
      required: true,
    },

    formationId: {
      type: String,
      required: true,
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

const inscriptionModel = mongoose.model("Inscription", inscriptionSchema);

module.exports = inscriptionModel;