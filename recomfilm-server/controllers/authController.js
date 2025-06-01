const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');  // Sequelize User model

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_here';  // Use environment variable in production

// Register user
exports.registerUser = async (req, res) => {
  try {
    const { username, password, bio } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    // Check if user with the same username exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      username,
      password_hash: hashedPassword,
      bio,
      reputation: 0,
      registered_at: new Date(),
    });

    return res.status(201).json({ message: 'User created', userId: newUser.id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// User login
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find user by username
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

