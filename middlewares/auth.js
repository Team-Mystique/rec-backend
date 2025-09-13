const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ 
                message: 'Access denied. No token provided.' 
            });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ 
                message: 'JWT secret not configured' 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user from database
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ 
                message: 'Invalid token - user not found' 
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ 
            message: 'Invalid token' 
        });
    }
};

// Middleware to check if user is admin
const verifyAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ 
            message: 'Access denied. Admin privileges required.' 
        });
    }
};

// Middleware to check if user is student
const verifyStudent = (req, res, next) => {
    if (req.user && req.user.role === 'student') {
        next();
    } else {
        return res.status(403).json({ 
            message: 'Access denied. Student privileges required.' 
        });
    }
};

module.exports = { 
    verifyToken, 
    verifyAdmin, 
    verifyStudent 
};
