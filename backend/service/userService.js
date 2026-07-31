import User from "../model/userModel.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'this_is_an_awesome_finance_manager';
const TOKEN_EXPIRES = process.env.JWT_EXPIRES || '12h';

// Token creation
const createToken = (userId) => {
    return jwt.sign({id: userId}, JWT_SECRET, {expiresIn: TOKEN_EXPIRES});
};

// User service functions
export const userService = {
    // Register user
    async registerUser(userData) {
        const { name, email, password } = userData;
        
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('Email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // Generate token
        const token = createToken(user._id);

        return {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        };
    },

    // Login user
    async loginUser(email, password) {
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        // Generate token
        const token = createToken(user._id);

        return {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        };
    },

    // Get user by ID
    async getUserById(userId) {
        const user = await User.findById(userId).select("name email");
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    },

    // Update user profile
    async updateProfile(userId, updateData) {
        const { name, email } = updateData;

        // Check if email is taken by another user
        const existingUser = await User.findOne({
            email,
            _id: { $ne: userId }
        });
        if (existingUser) {
            throw new Error('Email already in use');
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { name: name.trim(), email },
            { new: true, runValidators: true }
        ).select("name email");

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    },

    // Update password
    async updatePassword(userId, currentPassword, newPassword) {
        const user = await User.findById(userId).select("password");
        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new Error('Current password is incorrect');
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        return true;
    }
};