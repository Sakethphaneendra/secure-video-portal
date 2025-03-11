import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();

    // Generate JWT
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login route
 router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  console.log('Login request received:', { username, password }); // Log the request payload

  try {
    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      console.log('User not found:', username); // Log if user is not found
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Invalid password for user:', username); // Log if password is invalid
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    console.log('Login successful for user:', username); // Log successful login
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login error:', err); // Log any errors
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;