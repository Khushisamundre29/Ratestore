const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const {
  isValidName,
  isValidAddress,
  isValidEmail,
  isValidPassword
} = require('../utils/validators');

require('dotenv').config();

// normal user signup, role is always 'user' here
exports.signup = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    if (!isValidName(name)) {
      return res.status(400).json({ message: 'name should be between 20 and 60 characters' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'please enter a valid email' });
    }
    if (!isValidAddress(address)) {
      return res.status(400).json({ message: 'address should not be more than 400 characters' });
    }
    if (!isValidPassword(password)) {
      return res.status(400).json({
        message: 'password should be 8-16 characters and include one uppercase letter and one special character'
      });
    }

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'an account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, address, 'user']
    );

    res.status(201).json({ message: 'account created, you can login now' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'something went wrong, try again later' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(400).json({ message: 'invalid email or password' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'something went wrong, try again later' });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!isValidPassword(newPassword)) {
      return res.status(400).json({
        message: 'new password should be 8-16 characters and include one uppercase letter and one special character'
      });
    }

    const [rows] = await pool.query('SELECT password FROM users WHERE id = ?', [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'user not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: 'old password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);

    res.json({ message: 'password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'something went wrong, try again later' });
  }
};