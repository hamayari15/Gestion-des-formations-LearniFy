const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: 3,
      maxlength: 100,
    },

    Age: {
      type: Number,
      required: [true, "Age is required"],
      min: 16,
      max: 100,
    },

    Gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["Male", "Female"],
    },

    Email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
    },

    Password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },

    Profile: {
      type: String,
      enum: ["User"],
      default: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Participant = mongoose.model("Participant", participantSchema);

module.exports = Participant;
