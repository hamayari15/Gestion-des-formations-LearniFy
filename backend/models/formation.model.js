const mongoose = require("mongoose");

const formationSchema = new mongoose.Schema(
  {
    theme: {
      type: String,
      required: true,
    },

    modeFormation: {
      type: String,
      enum: ["En ligne", "Présentiel", "Hybride"],
      required: [true, "Mode de formation is required"],
    },

    numSalle: {
      type: Number,
      required: function () {
        return this.modeFormation === "Présentiel";
      },
    },

    creditImpot: {
      type: Boolean,
      default: false,
    },

    droitIndividuel: {
      type: Boolean,
      default: false,
    },

    droitCollectif: {
      type: Boolean,
      default: false,
    },

    periodeDu: {
      type: Date,
      required: [true, "Start date is required"],
    },

    periodeA: {
      type: Date,
      required: [true, "End date is required"],
    },

    horaireDu: {
      type: String,
      required: [true, "Start time is required"],
    },

    horaireA: {
      type: String,
      required: [true, "End time is required"],
    },

     isArchived: {
      type: Boolean,
      default: false,
    },

  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const formationModel = mongoose.model("Formation", formationSchema);

module.exports = formationModel;