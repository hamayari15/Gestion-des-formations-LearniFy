const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: 3,
      maxlength: 100,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },

    profile: {
      type: String,
      enum: ["admin"],
      default: "admin",
    },
  },
  {
    timestamps: true, 
    versionKey: false,
  }
);

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;