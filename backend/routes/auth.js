const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Login or Create User
router.post('/login', async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username || username.trim().length < 3) {
      return res.status(400).json({ 
        message: 'Username must be at least 3 characters' 
      });
    }

    // Find or create user
    let user = await User.findOne({ username: username.trim() });
    
    if (!user) {
      user = new User({ 
        username: username.trim(),
        isOnline: true,
        lastSeen: Date.now()
      });
      await user.save();
    } else {
      // Update online status
      user.isOnline = true;
      user.lastSeen = Date.now();
      await user.save();
    }

    res.json({ 
      user: {
        id: user._id,
        username: user.username,
        isOnline: user.isOnline
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all online users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find()
      .select('username isOnline lastSeen createdAt')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user status (logout)
router.post('/logout', async (req, res) => {
  try {
    const { userId } = req.body;
    await User.findByIdAndUpdate(userId, {
      isOnline: false,
      lastSeen: Date.now()
    });
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;