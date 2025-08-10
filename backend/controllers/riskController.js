const Risk = require( "../models/Risk.js");
const User = require("../models/User");
// Get all risks
exports.getAllRisks = async (req, res) => {
  try {
    const empID = req.headers.empid;
    if (!empID) {
      return res.status(400).json({ message: "empID missing" });
    }

    // Find current logged-in user
    const currentUser = await User.findOne({ employeeId: empID });
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    let query = {};
    if (currentUser.role === "superadmin") {
      // Superadmin can see all risks
      query = {};
    } else if (currentUser.role === "developer") {
      // Developer sees risks created by their creator
      if (currentUser.createdBy) {
        query = { empID: currentUser.createdBy };
      } else {
        query = { empID: empID }; // fallback to their own risks
      }
    } else if (currentUser.role === "admin") {
      // Admin: fetch only their own risks
      query = { empID: empID };
    } else {
      // Developer/Client: fetch risks created by the account creator
      if (currentUser.createdBy) {
        query = { empID: currentUser.createdBy };
      } else {
        query = { empID: empID };
      }
    }

    const risks = await Risk.find(query).sort({ createdAt: -1 });
    res.json(risks);
  } catch (err) {
    console.error("Error fetching risks:", err);
    res.status(500).json({ message: "Error fetching risks" });
  }
};


// Create new risk
exports.createRisk = async (req, res) => {
  try {
    const newRisk = await Risk.create(req.body);
    res.status(201).json(newRisk);
  } catch (err) {
    res.status(400).json({ message: "Failed to create risk", error: err.message });
  }
};

// Update a risk
exports.updateRisk = async (req, res) => {
  try {
    const updated = await Risk.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Risk not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Update failed", error: err.message });
  }
};

// Delete a risk
exports.deleteRisk = async (req, res) => {
  try {
    await Risk.findByIdAndDelete(req.params.id);
    res.json({ message: "Risk deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};
