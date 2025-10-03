const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { userModel } = require("./db");
const { JWT_USER_PASSWORD } = require("./config");
const userauth = require("./middleware"); // Corrected: require the exported function directly

const router = express.Router();

// Secret for JWT
const JWT_SECRET = JWT_USER_PASSWORD;

// Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and Password are required" });
    }

    const existingUser = await userModel.findOne({ username: username.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ username: username.toLowerCase(), password: hashedPassword });
    await user.save();

    // Change 1: Include username in the JWT payload
    const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });
    // Change 2: Return username to the client
    res.status(201).json({ message: "User created successfully", token, username: user.username });
  } catch (error) {
    console.error("Signup Error:", error); 
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
});


// Signin Route
router.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await userModel.findOne({ username: username.toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Change 3: Include username in the JWT payload
    const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });
    // Change 4: Return username to the client
    res.status(200).json({ message: "Login successful", token, username: user.username });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
});

// Profile Route (Add JWT verification middleware if required)
// Change 5: Apply the userauth middleware to protect this route
router.get("/profile", userauth, async (req, res) => {
    try {
        // req.user is set by the userauth middleware
        const user = await userModel.findById(req.user.userId).select('username'); // Fetch only username for profile
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ username: user.username });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Error fetching profile", error: error.message });
    }
});

module.exports = router;