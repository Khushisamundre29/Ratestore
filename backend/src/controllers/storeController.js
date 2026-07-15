const pool = require('../config/db');

// normal user's view of stores, includes their own submitted rating for each store
exports.getStoresForUser = async (req, res) => {
  try {
    const { name, address } = req.query;
    const userId = req.user.id;

    let query = `
      SELECT s.id, s.name, s.address,
        ROUND(AVG(r.rating), 1) as overallRating,
        (SELECT rating FROM ratings WHERE user_id = ? AND store_id = s.id) as userRating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE 1 = 1
    `;
    const params = [userId];

    if (name) {
      query += ' AND s.name LIKE ?';
      params.push(`%${name}%`);
    }
    if (address) {
      query += ' AND s.address LIKE ?';
      params.push(`%${address}%`);
    }

    query += ' GROUP BY s.id ORDER BY s.name ASC';

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'something went wrong, try again later' });
  }
};