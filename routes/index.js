const express = require('express');
const router = express.Router();
const { home } = require('../controllers/indexController');
const { login, register } = require('../controllers/userController');
const dashboardRoutes = require('./dashboard');
const adminRoutes = require('./admin');

// Define a route for the home page
router.get('/', home); 

// Frontend integration info endpoint
router.get('/api-info', (req, res) => {
  res.json({
    status: 'success',
    message: 'Rise Edu Consult Backend API',
    version: '1.0.0',
    documentation: {
      baseUrl: `${req.protocol}://${req.get('host')}`,
      endpoints: {
        authentication: {
          register: 'POST /register',
          login: 'POST /login'
        },
        dashboard: {
          getDashboard: 'GET /api/dashboard (requires auth)',
          getProfile: 'GET /api/profile (requires auth)',
          updateProfile: 'PUT /api/profile (requires auth)'
        },
        admin: {
          getUsers: 'GET /api/admin/users (requires admin)',
          getUser: 'GET /api/admin/users/:id (requires admin)',
          updateUser: 'PUT /api/admin/users/:id (requires admin)',
          deleteUser: 'DELETE /api/admin/users/:id (requires admin)',
          getStats: 'GET /api/admin/stats (requires admin)'
        }
      },
      authHeader: 'Authorization: Bearer <token>',
      contentType: 'application/json'
    },
    cors: {
      allowedOrigins: process.env.ALLOWED_ORIGINS 
        ? process.env.ALLOWED_ORIGINS.split(',').map(url => url.trim())
        : ['http://localhost:3000', 'http://localhost:3001'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    },
    environment: process.env.NODE_ENV || 'development'
  });
});

// Authentication routes
router.post('/login', login);
router.post('/register', register);

// Dashboard routes
router.use('/api', dashboardRoutes);

// Admin routes
router.use('/api/admin', adminRoutes);

module.exports = router;

