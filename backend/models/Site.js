const mongoose = require('mongoose');

const siteSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: String,
    description: String,
    status: { type: String, default: 'active' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Site', siteSchema);