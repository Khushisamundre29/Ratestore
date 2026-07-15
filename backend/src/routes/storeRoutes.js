const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const verifyToken = require('../middleware/auth');
const checkRole = require('../middleware/role');

router.get('/', verifyToken, checkRole('user'), storeController.getStoresForUser);

module.exports = router;