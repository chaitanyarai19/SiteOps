const File = require("../models/File");
const fs  = require("fs");
const path = require("path");
const User = require("../models/User");

// Upload a new file
exports.uploadFile = async (req, res) => {
  try {
    const { sitename } = req.body;
    const fileUrl = `/uploads/${req.file.filename}`;

    const file = await File.create({
      sitename,
      fileUrl,
      uploadedAt: new Date(),
      empID: req.body.empID || null,
    });

    res.status(201).json(file);
  } catch (error) {
    res.status(500).json({ error: "File upload failed", details: error.message });
  }
};

// Get all uploaded files
exports.getAllFiles = async (req, res) => {
  try {
    const empID = req.headers.empid;
    if (!empID) {
      return res.status(400).json({ message: "empID missing" });
    }

    // Find the current logged-in user
    const currentUser = await User.findOne({ employeeId: empID });
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    let query = {};

    if (currentUser.role === "superadmin") {
      // Superadmin can see all files
      query = {};
    } else if (currentUser.role === "admin") {
      // Admin: show only their own files
      query = { empID: empID };
    } else {
      // Developer/Client: show files uploaded by their creator
      if (currentUser.createdBy) {
        query = { empID: currentUser.createdBy };
      } else {
        query = { empID: empID };
      }
    }

    const files = await File.find(query).sort({ uploadedAt: -1 }); // latest first
    res.status(200).json(files);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ error: "Unable to fetch files" });
  }
};


// DELETE file by ID
exports.deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findById(id);
    if (!file) return res.status(404).json({ message: "File not found" });

    // Delete from uploads folder
    const filePath = path.join(__dirname, "../uploads", path.basename(file.fileUrl));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from DB
    await File.findByIdAndDelete(id);

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ message: "Server error" });
  }
};
