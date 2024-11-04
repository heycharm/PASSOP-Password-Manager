const Password = require('../models/password'); // Adjust this path to your actual model

exports.savePassword = async (req, res) => {
    try {
        const { userId, site, username, password } = req.body;
        const newPassword = new Password({ userId, site, username, password });

        await newPassword.save();
        res.status(201).json({ message: 'Password saved successfully', newPassword });
    } catch (error) {
        console.error('Error saving password:', error);
        res.status(500).json({ message: 'Error saving password', error });
    }
};

// Delete password
exports.deletePassword = async (req, res) => {
    try {
        const { id } = req.params; // Get the ID from the request parameters
        const result = await Password.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Password not found' });
        }

        res.status(200).json({ message: 'Password deleted successfully' });
    } catch (error) {
        console.error('Error deleting password:', error);
        res.status(500).json({ message: 'Error deleting password', error });
    }
};
// You can add other functions here (e.g., for fetching, updating passwords)
