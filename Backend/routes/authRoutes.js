const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
// Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password , birthday, gender} = req.body;
    console.log("Received Signup Request:", req.body); // ✅ Debugging log

    if (!username || !email || !password || !birthday || !gender) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({ username, email, password: hashedPassword, birthday, gender});
    await newUser.save();

    // Generate Token
    const token = jwt.sign({ userId: newUser ._id, username: newUser .username }, process.env.JWT_SECRET, { expiresIn: "1d" });
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    // });

    res.status(201).json({ message: "User registered successfully!", token });
  } catch (error) {
    console.error("Signup Error:", error); // ✅ Logs full error in terminal

    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// Login Route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check user
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate Token
    const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({ success: true, message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Logout Route
router.post("/logout", (req, res) => {
  res.cookie("token", "", { expires: new Date(0) }).json({ message: "Logged out" });
});

module.exports = router;
