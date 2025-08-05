const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  tokens: { type: String },
  name: { type: String, required: true},
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: "admin" },
  employeeId: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
