import User from "../model/userModel.js";
import jwt from 'jsonwebtoken';

// Use environment variable for JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'this_is_an_awesome_finance_manager';

export default async function authMiddleware(req, res, next) {
    // Grab token from Authorization header
    const authHeader = req.headers.authorization;
    
    // Check if header exists and is a string
    if (!authHeader || typeof authHeader !== 'string') {
        return res.status(401).json({
            success: false,
            message: "Not authorized - No token provided or invalid format"
        });
    }

    // Check if header starts with "Bearer "
    if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Not authorized - Invalid token format. Use 'Bearer <token>'"
        });
    }

    // Extract the token (remove "Bearer " prefix)
    const token = authHeader.split(" ")[1];

    // Verify token exists after splitting
    if (!token || token.trim() === '') {
        return res.status(401).json({
            success: false,
            message: "Not authorized - Token is empty"
        });
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        // Find user by id (excluding password)
        const user = await User.findById(payload.id).select("-password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Token expired"
            });
        }
        console.error("Auth middleware error:", error);
        res.status(401).json({
            success: false,
            message: "Authentication failed"
        });
    }
}