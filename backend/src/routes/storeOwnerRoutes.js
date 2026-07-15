const express = require('express');
const router = express.Router();
const storeOwnerController = require('../controllers/storeOwnerController');
const verifyToken = require('../middleware/auth');
const checkRole = require('../middleware/role');

router.get('/dashboard', verifyToken, checkRole('store_owner'), storeOwnerController.getMyStoreDashboard);

module.exports = router;