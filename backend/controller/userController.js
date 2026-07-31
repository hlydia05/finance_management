import { clerkClient } from '@clerk/clerk-sdk-node';
import User from '../model/userModel.js';
import mongoose from 'mongoose'; // FIXED: Added missing import

/**
 * Get current authenticated user
 */
export async function getCurrentUser(req, res) {
    try {
        // User is already attached by auth middleware
        res.json({ 
            success: true, 
            user: req.user 
        });
    } catch (error) {
        console.error('GetCurrentUser error:', error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

/**
 * Update user profile
 */
export async function updateProfile(req, res) {
    const { name, preferences } = req.body;
    const userId = req.user._id;

    try {
        const updateData = {};
        if (name) updateData.name = name.trim();
        if (preferences) updateData.preferences = preferences;

        const user = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password -clerkMetadata');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            user,
            message: "Profile updated successfully"
        });
    } catch (error) {
        console.error('UpdateProfile error:', error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

/**
 * Get user statistics (custom endpoint)
 */
export async function getUserStats(req, res) {
    try {
        const userId = req.user._id;
        
        // Get counts from other collections - FIXED: Use dynamic imports or require
        // Since we can't import models here directly, use mongoose.model
        const IncomeModel = mongoose.model('income');
        const ExpenseModel = mongoose.model('expense');
        
        const [incomeCount, expenseCount] = await Promise.all([
            IncomeModel.countDocuments({ userId }),
            ExpenseModel.countDocuments({ userId }),
        ]);

        res.json({
            success: true,
            data: {
                incomeCount,
                expenseCount,
                totalTransactions: incomeCount + expenseCount,
            }
        });
    } catch (error) {
        console.error('GetUserStats error:', error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}