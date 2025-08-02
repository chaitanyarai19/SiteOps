const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

// @route   GET api/dashboard
// @desc    Get dashboard stats (sites, tickets, users count)
// @access  Private
router.get('/dashboard', auth, getDashboardStats);

module.exports = router;

