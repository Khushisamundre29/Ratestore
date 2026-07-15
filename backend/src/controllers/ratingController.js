const pool = require('../config/db');
const { isValidRating } = require('../utils/validators');

// this handles both first time submission and updating an existing rating
exports.submitRating = async (req, res) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.id;

    if (!isValidRating(rating)) {
      return res.status(400).json({ message: 'rating must be a number between 1 and 5' });
    }

    const [storeRows] = await pool.query('SELECT id FROM stores WHERE id = ?', [storeId]);
    if (storeRows.length === 0) {
      return res.status(404).json({ message: 'store not found' });
    }

    const [existing] = await pool.query(
      'SELECT id FROM ratings WHERE user_id = ? AND store_id = ?',
      [userId, storeId]
    );

    if (existing.length > 0) {
      await pool.query('UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?', [
        rating,
        userId,
        storeId
      ]);
      return res.json({ message: 'rating updated' });
    }

    await pool.query('INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)', [
      userId,
      storeId,
      rating
    ]);

    res.status(201).json({ message: 'rating submitted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'something went wrong, try again later' });
  }
};