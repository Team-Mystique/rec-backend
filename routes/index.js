const express = require('express');
const router = express.Router();
const { home } = require('../controllers/indexController');

// Define a route for the home page
router.get('/', home); 

module.exports = router;

