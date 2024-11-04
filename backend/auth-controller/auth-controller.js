const User = require("../models/user-model");

const home = async (req, res) => {
  try {
    res.status(200).send("welcome to mern app");
  } catch (error) {
    console.log(error);
  }
};

// REGISTRATION LOGIC
const register = async (req, res) => {
    try {
      console.log('Received registration data:', req.body); // Log incoming data
  
      const { username, email, phone, password } = req.body;
  
      // Validate that all required fields are present
      if (!username || !email || !phone || !password) {
        return res.status(400).json({ msg: "All fields are required." });
      }
  
      // Check if user already exists
      const userExist = await User.findOne({ email });
      if (userExist) {
        return res.status(400).json({ msg: "Email already exists" });
      }
  
      // Create the user
      const userCreated = await User.create({ username, email, phone, password });
      res.status(200).json({ msg: userCreated });
    } catch (error) {
      console.error("Error during registration:", error);
      res.status(400).json({ msg: "Error during registration" });
    }
  };
  
// LOGIN
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Check if password matches (assuming you are storing plain text passwords)
        if (user.password !== password) {
            return res.status(400).json({ msg: "Invalid password" });
        }

        // If login is successful, send back user data or a success message
        res.status(200).json({ msg: "Login successful", user });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ msg: "Server error" });
    }
}

module.exports = { home, register, login }; // Don't forget to export the login function
