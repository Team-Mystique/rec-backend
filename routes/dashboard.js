const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const User = require('../models/User');

// Get user dashboard data
router.get('/dashboard', verifyToken, async (req, res) => {
    try {
        const user = req.user;
        
        // Get user stats based on role
        let dashboardData = {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            stats: {},
            recentActivity: []
        };

        if (user.role === 'admin') {
            // Admin dashboard data
            const totalUsers = await User.countDocuments();
            const totalStudents = await User.countDocuments({ role: 'student' });
            const totalAdmins = await User.countDocuments({ role: 'admin' });

            dashboardData.stats = {
                totalUsers,
                totalStudents,
                totalAdmins,
                recentRegistrations: totalUsers // Placeholder
            };
        } else if (user.role === 'student') {
            // Student dashboard data
            dashboardData.stats = {
                enrolledCourses: 0, // Placeholder - would connect to courses when implemented
                completedCourses: 0,
                pendingAssignments: 0,
                upcomingClasses: 0
            };
        }

        res.json({
            status: 'success',
            message: 'Dashboard data retrieved successfully',
            data: dashboardData
        });

    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({
            message: 'Failed to load dashboard data',
            error: error.message
        });
    }
});

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const user = req.user;
        
        res.json({
            status: 'success',
            message: 'Profile data retrieved successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });

    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({
            message: 'Failed to load profile data',
            error: error.message
        });
    }
});

// Update user profile
router.put('/profile', verifyToken, async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user._id;

        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name },
            { new: true, select: '-password' }
        );

        res.json({
            status: 'success',
            message: 'Profile updated successfully',
            user: updatedUser
        });

    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({
            message: 'Failed to update profile',
            error: error.message
        });
    }
});

module.exports = router;
