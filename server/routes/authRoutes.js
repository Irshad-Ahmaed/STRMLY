const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');
const authenticate = require('../middleware/auth');


// Public routes
router.post('/register', authController.signup);
router.post('/login', authController.login);

// Protected route
router.get('/profile', authenticate, authController.getProfile);

module.exports = router;