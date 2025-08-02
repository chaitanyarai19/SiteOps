const express = require('express');
const router = express.Router();
const Site = require('../models/Site');

// Get all sites
router.get('/', async (req, res) => {
    try {
        const sites = await Site.find();
        res.json(sites);
    } catch (err) {
        res.status(500).json({ message: err.message });
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