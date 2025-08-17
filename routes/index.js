const express = require('express');
const router = express.Router();
const { home } = require('../controllers/indexController');
const { login, register } = require('../controllers/userController');

// Define a route for the home page
router.get('/', home); 

// Login route
router.post('/login', login);
router.post('/register', register)

module.exports = router;

