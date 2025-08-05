// routes/uploadRoutes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const { uploadFile } = require("../controllers/uploadController");

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("file"), uploadFile);

module.exports = router;
