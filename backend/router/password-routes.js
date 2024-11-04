// router/password-routes.js
const express = require("express");
const router = express.Router();
const Password = require("../models/password");
const mongoose = require('mongoose');

const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return next();
    } else {
        return res.status(401).json({ msg: "Unauthorized" });
    }
};

// Update password by ID

// PUT: Update a password by ID
router.put('/:id', async (req, res) => {
    console.log("Received ID:", req.params.id);
    console.log("Received Body:", req.body);
  
    const { id } = req.params;
    const { site, username, password } = req.body;
  
    try {
      console.log("Looking for ID:", id);
      const updatedPassword = await Password.findByIdAndUpdate(
        id,
        { site, username, password },
        { new: true }
      );
  
      console.log("Updated Password Result:", updatedPassword);
  
      if (!updatedPassword) {
        return res.status(404).json({ message: 'Password not found' });
      }
  
      res.status(200).json({ message: 'Password updated successfully', updatedPassword });
    } catch (error) {
      console.error('Error updating password:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });



// Delete password route
router.delete('/:id', async (req, res) => {
    console.log('Received ID:', req.params.id);
    console.log('Full request URL:', req.url);

    const { id } = req.params;

    // Validate MongoDB ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }

    try {
        const deletedPassword = await Password.findByIdAndDelete(id);

        if (!deletedPassword) {
            console.log(`No document found with ID: ${id}`);
            return res.status(404).json({ message: 'Password not found' });
        }

        res.status(200).json({ message: 'Password deleted successfully' });
    } catch (error) {
        console.error('Error deleting password:', error); // Detailed error log
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Save a password
router.post("/", isAuthenticated, async (req, res) => {
    const { site, username, password } = req.body;
    const userId = req.session.userId;

    const passwordData = new Password({ site, username, password, userId });

    try {
        const savedPassword = await passwordData.save();
        res.status(201).json({ success: true, result: savedPassword });
    } catch (error) {
        console.error("Error saving password:", error);
        res.status(500).json({ success: false, message: "Error saving password", error });
    }
});


// Get passwords
router.get("/", isAuthenticated, async (req, res) => {
    const userId = req.session.userId;

    try {
        const userPasswords = await Password.find({ userId });
        res.status(200).json(userPasswords);
    } catch (error) {
        console.error("Error fetching passwords:", error);
        res.status(500).json({ success: false, message: "Error fetching passwords", error });
    }
});


module.exports = router;
