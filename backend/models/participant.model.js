const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: 3,
      maxlength: 100,
    },

    age: {
      type: Number,
      required: [true, "Age is required"],
      min: 16,
      max: 100,
    },

    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["Male", "Female"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },

    profile: {
      type: String,
      enum: ["user"],
      default: "user",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Participant = mongoose.model("Participant", participantSchema);

module.exports = Participant;
