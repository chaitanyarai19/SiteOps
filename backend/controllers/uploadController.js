// controllers/uploadController.js
const File = require("../models/File");

exports.uploadFile = async (req, res) => {
  try {
    const { sitename } = req.body;

    if (!req.file || !sitename) {
      return res.status(400).json({ message: "File or sitename is missing." });
    }

    const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;

    const newFile = new File({
      sitename,
      fileUrl,
      empID: req.body.empID || null,
    });

    await newFile.save();

    return res.status(200).json({ message: "File uploaded and saved!", fileUrl });
  } catch (error) {
    console.error("Error uploading file:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
