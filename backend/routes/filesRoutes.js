const express = require('express');
const multer = require("multer");
const {
  uploadFile,
  getAllFiles,
  deleteFile,
} = require("../controllers/fileController.js");
const fileController = require("../controllers/fileController");

const router = express.Router();

// Set up multer
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Routes
router.post("/upload", upload.single("file"), uploadFile);
router.get("/", getAllFiles);
// router.delete("/:id", deleteFile);
router.delete("/:id", fileController.deleteFile);
module.exports = router;