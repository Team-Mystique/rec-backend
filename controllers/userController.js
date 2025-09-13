const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Register a user
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields (name, email, password, role) are required" });
    }

    // Validate role
    const validRoles = ['admin', 'student'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Role must be either 'admin' or 'student'" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already registered" });
    }

    // Hash password 
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with hashed password
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: "Failed to register user",
      error: error.message
    });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Validate JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT secret not configured" });
    }

    // Find user
    const getUser = await User.findOne({ email });
    if (!getUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, getUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Generate JWT
    const accessToken = jwt.sign(
      { id: getUser._id, role: getUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      accessToken,
      user: {
        id: getUser._id,
        name: getUser.name,
        email: getUser.email,
        role: getUser.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      message: "Failed to login user",
      error: error.message
    });
  }
};

module.exports = { login, register };

