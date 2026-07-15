const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const verifyToken = require('../middleware/auth');
const checkRole = require('../middleware/role');

router.post('/', verifyToken, checkRole('user'), ratingController.submitRating);

module.exports = router;