const express = require('express');
const router = express.Router();
const Site = require('../models/Site');
const User = require("../models/User");


// GET /api/sites
router.get("/", async (req, res) => {   // <-- async added here
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
  // Superadmin can see all sites
  query = {};
} else if (currentUser.role === "admin") {
  // Admin sees only sites where empID matches their employeeId
  query = { empID: empID };
} else {
  // Developer sees sites where empID matches their creator's employeeId
  if (currentUser.createdBy) {
    query = { empID: currentUser.createdBy };
  } else {
    // fallback - if no creator, see only their own sites
    query = { empID: empID };
  }
}


    const sites = await Site.find(query);
    res.json(sites);
  } catch (err) {
    console.error("Error fetching sites:", err);
    res.status(500).json({ message: "Server error" });
  }
});




// Create a new site
router.post('/', async (req, res) => {
    const site = new Site(req.body);
    try {
        const newSite = await site.save();
        res.status(201).json(newSite);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get a single site
router.get('/:id', async (req, res) => {
    try {
        const site = await Site.findById(req.params.id);
        if (!site) return res.status(404).json({ message: 'Site not found' });
        res.json(site);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a site
router.put('/:id', async (req, res) => {
    try {
        const updatedSite = await Site.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedSite);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a site
router.delete('/:id', async (req, res) => {
    try {
        await Site.findByIdAndDelete(req.params.id);
        res.json({ message: 'Site deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;