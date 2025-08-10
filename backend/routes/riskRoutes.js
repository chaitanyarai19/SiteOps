const express = require('express');
const router = express.Router();
const Risk = require('../models/Risk');

const {
  getAllRisks,
  createRisk,
  updateRisk,
  deleteRisk
} = require("../controllers/riskController.js");


router.get("/", getAllRisks)
;
router.post("/", createRisk);
router.put("/:id", updateRisk);
router.delete("/:id", deleteRisk);

module.exports = router;
