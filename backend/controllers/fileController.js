const File = require("../models/File");
const fs  = require("fs");
const path = require("path");

// Upload a new file
exports.uploadFile = async (req, res) => {
  try {
    const { sitename } = req.body;
    const fileUrl = `/uploads/${req.file.filename}`;

    const file = await File.create({
      sitename,
      fileUrl,
      uploadedAt: new Date(),
    });

    res.status(201).json(file);
  } catch (error) {
    res.status(500).json({ error: "File upload failed", details: error.message });
  }
};

// Get all uploaded files
exports.getAllFiles = async (req, res) => {
  try {
    const files = await File.find().sort({ uploadedAt: -1 }); // latest first
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch files" });
  }
};

// Delete a file by ID
exports.deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    const filepath = path.join(path.resolve(), "uploads", path.basename(file.fileUrl));
    fs.unlink(filepath, (err) => {
      if (err) console.warn("File not found in filesystem or already deleted:", filepath);
    });

    await file.deleteOne();
    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete file", details: error.message });
  }
};
