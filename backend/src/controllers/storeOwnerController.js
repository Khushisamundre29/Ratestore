const pool = require('../config/db');

// gets the store owned by the logged in owner along with the raters and average rating
// note: this assumes one store per owner, keeping it simple as per the requirements
exports.getMyStoreDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const [storeRows] = await pool.query('SELECT * FROM stores WHERE owner_id = ?', [ownerId]);
    if (storeRows.length === 0) {
      return res.status(404).json({ message: 'no store is linked to your account yet' });
    }

    const store = storeRows[0];

    const [ratingRows] = await pool.query(
      `SELECT u.name, u.email, r.rating, r.created_at
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.store_id = ?
       ORDER BY r.created_at DESC`,
      [store.id]
    );

    const [[avgResult]] = await pool.query(
      'SELECT ROUND(AVG(rating), 1) as average FROM ratings WHERE store_id = ?',
      [store.id]
    );

    res.json({
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address
      },
      averageRating: avgResult.average || 0,
      raters: ratingRows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'something went wrong, try again later' });
  }
};