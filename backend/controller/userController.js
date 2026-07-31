import validator from "validator";
import { userService } from "../service/userService.js";

// Sign up user
export async function registerUser(req, res) {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({
            success: false,
            message: "Invalid email format"
        });
    }

    if (password.length < 8) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters"
        });
    }

    try {
        const result = await userService.registerUser({ name, email, password });
        res.status(201).json({
            success: true,
            ...result
        });
    } catch (error) {
        if (error.message === 'Email already exists') {
            return res.status(409).json({
                success: false,
                message: error.message
            });
        }
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

// Login user
export async function loginUser(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    try {
        const result = await userService.loginUser(email, password);
        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        if (error.message === 'User not found' || error.message === 'Invalid password') {
            return res.status(401).json({
                success: false,
                message: error.message
            });
        }
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

// Get current user
export async function getCurrentUser(req, res) {
    try {
        const user = await userService.getUserById(req.user.id);
        res.json({ success: true, user });
    } catch (error) {
        if (error.message === 'User not found') {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

// Update profile
export async function updateProfile(req, res) {
    const { name, email } = req.body;

    if (!name || name.trim() === '' || !email || !validator.isEmail(email)) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid name and email"
        });
    }

    try {
        const user = await userService.updateProfile(req.user.id, { name, email });
        res.json({
            success: true,
            user
        });
    } catch (error) {
        if (error.message === 'Email already in use') {
            return res.status(409).json({
                success: false,
                message: error.message
            });
        }
        if (error.message === 'User not found') {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

// Update password
export async function updatePassword(req, res) {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword || newPassword.length < 8) {
        return res.status(400).json({
            success: false,
            message: "Password invalid or too short"
        });
    }

    try {
        await userService.updatePassword(req.user.id, currentPassword, newPassword);
        res.json({
            success: true,
            message: "Password changed successfully"
        });
    } catch (error) {
        if (error.message === 'Current password is incorrect') {
            return res.status(401).json({
                success: false,
                message: error.message
            });
        }
        if (error.message === 'User not found') {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}