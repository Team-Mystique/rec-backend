const express = require('express');
const router = express.Router();
const { home } = require('../controllers/indexController');
const { login, register } = require('../controllers/userController');
const dashboardRoutes = require('./dashboard');
const adminRoutes = require('./admin');

// Define a route for the home page
router.get('/', home); 

// Authentication routes
router.post('/login', login);
router.post('/register', register);

// Dashboard routes
router.use('/api', dashboardRoutes);

// Admin routes
router.use('/api/admin', adminRoutes);

module.exports = router;

