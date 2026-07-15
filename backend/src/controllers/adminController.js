const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const {
  isValidName,
  isValidAddress,
  isValidEmail,
  isValidPassword
} = require('../utils/validators');

exports.getDashboardStats = async (req, res) => {
  try {
    const [[userCount]] = await pool.query('SELECT COUNT(*) as total FROM users');
    const [[storeCount]] = await pool.query('SELECT COUNT(*) as total FROM stores');
    const [[ratingCount]] = await pool.query('SELECT COUNT(*) as total FROM ratings');

    res.json({
      totalUsers: userCount.total,
      totalStores: storeCount.total,
      totalRatings: ratingCount.total
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'something went wrong, try again later' });
  }
};

// admin can create a user with any role (user or admin)
exports.addUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

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
    if (!['admin', 'user', 'store_owner'].includes(role)) {
      return res.status(400).json({ message: 'role must be admin, user or store_owner' });
    }

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'an account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, address, role]
    );

    res.status(201).json({ message: 'user created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'something went wrong, try again later' });
  }
};

exports.addStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    if (!isValidName(name)) {
      return res.status(400).json({ message: 'store name should be between 20 and 60 characters' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'please enter a valid email' });
    }
    if (!isValidAddress(address)) {
      return res.status(400).json({ message: 'address should not be more than 400 characters' });
    }

    if (ownerId) {
      const [ownerRows] = await pool.query('SELECT id, role FROM users WHERE id = ?', [ownerId]);
      if (ownerRows.length === 0) {
        return res.status(400).json({ message: 'selected store owner does not exist' });
      }
      if (ownerRows[0].role !== 'store_owner') {
        return res.status(400).json({ message: 'selected user is not a store owner' });
      }
    }

    await pool.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
      [name, email, address, ownerId || null]
    );

    res.status(201).json({ message: 'store added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'something went wrong, try again later' });
  }
};

// list of users with optional filters and sorting
exports.getUsers = async (req, res) => {
  try {
    const { name, email, address, role, sortBy, order } = req.query;

    let query = `
      SELECT u.id, u.name, u.email, u.address, u.role,
        (SELECT ROUND(AVG(r.rating), 1) FROM ratings r
          JOIN stores s ON r.store_id = s.id
          WHERE s.owner_id = u.id) as rating
      FROM users u WHERE 1 = 1
    `;
    const params = [];

    if (name) {
      query += ' AND u.name LIKE ?';
      params.push(`%${name}%`);
    }
    if (email) {
      query += ' AND u.email LIKE ?';
      params.push(`%${email}%`);
    }
    if (address) {
      query += ' AND u.address LIKE ?';
      params.push(`%${address}%`);
    }
    if (role) {
      query += ' AND u.role = ?';
      params.push(role);
    }

    const allowedSort = ['name', 'email', 'address', 'role'];
    const sortField = allowedSort.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order === 'desc' ? 'DESC' : 'ASC';
    query += ` ORDER BY u.${sortField} ${sortOrder}`;

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'something went wrong, try again later' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.email, u.address, u.role,
        (SELECT ROUND(AVG(r.rating), 1) FROM ratings r
          JOIN stores s ON r.store_id = s.id
          WHERE s.owner_id = u.id) as rating
      FROM users u WHERE u.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'user not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'something went wrong, try again later' });
  }
};

// list of stores with optional filters and sorting, includes overall rating
exports.getStores = async (req, res) => {
  try {
    const { name, email, address, sortBy, order } = req.query;

    let query = `
      SELECT s.id, s.name, s.email, s.address,
        ROUND(AVG(r.rating), 1) as rating,
        COUNT(r.id) as totalRatings
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE 1 = 1
    `;
    const params = [];

    if (name) {
      query += ' AND s.name LIKE ?';
      params.push(`%${name}%`);
    }
    if (email) {
      query += ' AND s.email LIKE ?';
      params.push(`%${email}%`);
    }
    if (address) {
      query += ' AND s.address LIKE ?';
      params.push(`%${address}%`);
    }

    query += ' GROUP BY s.id';

    const allowedSort = ['name', 'email', 'address', 'rating'];
    const sortField = allowedSort.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order === 'desc' ? 'DESC' : 'ASC';
    query += ` ORDER BY ${sortField === 'rating' ? 'rating' : 's.' + sortField} ${sortOrder}`;

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'something went wrong, try again later' });
  }
};

// used to populate a dropdown of store owners when adding a store
exports.getStoreOwners = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email FROM users WHERE role = 'store_owner'"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'something went wrong, try again later' });
  }
};