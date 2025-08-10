const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email or password' });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(400).json({ message: 'Invalid email or password' });
           res.cookie("empID", user.employeeId, {
      httpOnly: false, // make true for security if you don't need client JS to access it
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
      sameSite: "Lax", // "Strict" or "None" depending on your setup
      secure: false,   // true in production (if HTTPS)
    });
        res.status(200).json({ message: 'Login successful', user });
    
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
    // Destructure all expected fields from the request body
    const empID = req.headers.empid;
    const { name, email, password, role, employeeId, createdBy, token } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user with all provided fields
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'user',
            employeeId, // Add employeeId
            createdBy: createdBy || empID, // Use empID from headers if createdBy is not provided
            tokens: token // Add token to the 'tokens' field
        });

        await user.save();

        // Create a user object for the response, excluding the password
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).json({ message: 'User registered successfully', user: userResponse });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
