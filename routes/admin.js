const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middlewares/auth');
const User = require('../models/User');

// Get all users (Admin only)
router.get('/users', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const users = await User.find()
            .select('-password')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const totalUsers = await User.countDocuments();
        const totalPages = Math.ceil(totalUsers / limit);

        res.json({
            status: 'success',
            message: 'Users retrieved successfully',
            data: {
                users,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalUsers,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            }
        });

    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            message: 'Failed to retrieve users',
            error: error.message
        });
    }
});

// Get user by ID (Admin only)
router.get('/users/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            status: 'success',
            message: 'User retrieved successfully',
            user
        });

    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            message: 'Failed to retrieve user',
            error: error.message
        });
    }
});

// Update user (Admin only)
router.put('/users/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { name, email, role } = req.body;
        const userId = req.params.id;

        // Validate role if provided
        if (role && !['admin', 'student'].includes(role)) {
            return res.status(400).json({ message: "Role must be either 'admin' or 'student'" });
        }

        // Validate email format if provided
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: "Please provide a valid email address" });
            }

            // Check if email is already taken by another user
            const existingUser = await User.findOne({ email, _id: { $ne: userId } });
            if (existingUser) {
                return res.status(400).json({ message: "Email already taken by another user" });
            }
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (role) updateData.role = role;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, select: '-password' }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            status: 'success',
            message: 'User updated successfully',
            user: updatedUser
        });

    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            message: 'Failed to update user',
            error: error.message
        });
    }
});

// Delete user (Admin only)
router.delete('/users/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Prevent admin from deleting themselves
        if (userId === req.user._id.toString()) {
            return res.status(400).json({ message: 'Cannot delete your own account' });
        }

        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            status: 'success',
            message: 'User deleted successfully'
        });

    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            message: 'Failed to delete user',
            error: error.message
        });
    }
});

// Get admin statistics (Admin only)
router.get('/stats', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalAdmins = await User.countDocuments({ role: 'admin' });
        
        // Get recent registrations (last 30 days)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const recentRegistrations = await User.countDocuments({ 
            createdAt: { $gte: thirtyDaysAgo } 
        });

        res.json({
            status: 'success',
            message: 'Statistics retrieved successfully',
            stats: {
                totalUsers,
                totalStudents,
                totalAdmins,
                recentRegistrations
            }
        });

    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({
            message: 'Failed to retrieve statistics',
            error: error.message
        });
    }
});

module.exports = router;
