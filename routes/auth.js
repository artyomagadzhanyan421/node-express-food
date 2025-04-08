const express = require('express');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const User = require('../mongodb/models/User');
const Token = require('../mongodb/models/Token');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// POST request (create a new user)
router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check for missing values
        if (!username || !password) {
            return res.status(400).json({ message: 'All fields are required!' });
        }

        // Check for existing user
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already in use!' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully!' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST request (to enter an account)
router.post('/signin', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required!' });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials!' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials!' });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user._id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token, username: user.username, role: user.role });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET request (to render our username)
router.get('/', authMiddleware, (req, res) => {
    res.send(`Hello, ${req.user.username}!`);
});

// POST request (to leave an account)
router.post('/signout', authMiddleware, async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.decode(token);

        // Save blacklisted token with its expiration time
        const newToken = new Token({
            token,
            expiresAt: new Date(decoded.exp * 1000) // JWT expiration is in seconds
        });

        await newToken.save();

        res.status(200).json({ message: 'Signed out successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to sign out!' });
    }
});

module.exports = router;