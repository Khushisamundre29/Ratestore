const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const verifyToken = require('../middleware/auth');
const checkRole = require('../middleware/role');

router.use(verifyToken, checkRole('admin'));

router.get('/dashboard', adminController.getDashboardStats);
router.post('/users', adminController.addUser);
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserById);
router.post('/stores', adminController.addStore);
router.get('/stores', adminController.getStores);
router.get('/store-owners', adminController.getStoreOwners);

module.exports = router;