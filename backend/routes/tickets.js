const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const User = require("../models/User");

// Get all tickets
router.get("/", async (req, res) => {
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
      // Superadmin: see all tickets
      query = {};
    } else if (currentUser.role === "admin") {
      // Admin: see only tickets they created
      query = { empID: empID };
    } else {
      // Developer or Client: see tickets where empID matches their creator's employeeId
      if (currentUser.createdBy) {
        query = { empID: currentUser.createdBy };
      } else {
        query = { empID: empID };
      }
    }

    const tickets = await Ticket.find(query);
    res.json(tickets);
  } catch (err) {
    console.error("Error fetching tickets:", err);
    res.status(500).json({ message: "Server error" });
  }
});



// Create a new ticket
router.post('/', async (req, res) => {
    const ticket = new Ticket(req.body);
    try {
        const newTicket = await ticket.save();
        res.status(201).json(newTicket);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get a single ticket
router.get('/:id', async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
        res.json(ticket);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a ticket
router.put('/:id', async (req, res) => {
    try {
        const updatedTicket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedTicket);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a ticket
router.delete('/:id', async (req, res) => {
    try {
        await Ticket.findByIdAndDelete(req.params.id);
        res.json({ message: 'Ticket deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;