// const express = require("express");
// const multer = require("multer");
// const router = express.Router();
// const File = require("../models/File");

// // Configure multer
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
// });
// const upload = multer({ storage });

// router.post("/", upload.single("file"), async (req, res) => {
//   try {
//     const { sitename } = req.body;
//     const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;
//     const empID = req.body.empID || null;

//     if (!sitename || !req.file) {
//       return res.status(400).json({ message: "Site name and file are required." });
//     }

//     const newFile = new File({ sitename, fileUrl, empID });
//     await newFile.save();

//     res.json({ message: "File uploaded and saved!", fileUrl });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;
