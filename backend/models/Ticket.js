const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    empID: { type: String, required: false },
    site: { type: mongoose.Schema.Types.ObjectId, ref: 'Site' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ticket', ticketSchema);