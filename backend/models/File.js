const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  sitename: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("File", FileSchema);
