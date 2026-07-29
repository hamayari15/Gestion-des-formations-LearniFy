const mongoose = require("mongoose");

const loginHistorySchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    ip: { type: String },
    userAgent: { type: String },
    device: { type: String },
    loginAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

loginHistorySchema.index({ admin: 1, loginAt: -1 });

module.exports =
  mongoose.models.LoginHistory ||
  mongoose.model("LoginHistory", loginHistorySchema);