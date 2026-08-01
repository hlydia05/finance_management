import { createClerkClient } from '@clerk/clerk-sdk-node';
import User from '../model/userModel.js';

// Initialize Clerk client
const clerk = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
});

/**
 * Authentication middleware using Clerk
 * Verifies the JWT token from the Authorization header
 * Creates user in database if they don't exist (just-in-time)
 * Attaches the user to the request object
 */
export default async function authMiddleware(req, res, next) {
    try {
        // Get the authorization header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized - No token provided or invalid format'
            });
        }

        const token = authHeader.split(' ')[1];
        
        if (!token || token.trim() === '') {
            return res.status(401).json({
                success: false,
                message: 'Not authorized - Token is empty'
            });
        }

        // Verify token with Clerk - Using clerk.verifyToken()
        const session = await clerk.verifyToken(token);
        
        if (!session || !session.sub) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }

        // Try to find user in database
        let user = await User.findOne({ clerkUserId: session.sub }).select('-clerkMetadata');

        if (!user) {
            // User doesn't exist yet - create them now (just-in-time)
            try {
                // Get user from Clerk using clerk.users.getUser()
                const clerkUser = await clerk.users.getUser(session.sub);
                const primaryEmail = clerkUser.emailAddresses.find(
                    email => email.id === clerkUser.primaryEmailAddressId
                );

                user = await User.create({
                    clerkUserId: session.sub,
                    email: primaryEmail?.emailAddress || '',
                    name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User',
                    clerkMetadata: {
                        profileImageUrl: clerkUser.profileImageUrl,
                        clerkCreatedAt: new Date(clerkUser.createdAt),
                        clerkUpdatedAt: new Date(clerkUser.updatedAt),
                    },
                    lastLoginAt: new Date(),
                    isActive: true,
                });

                console.log(`✅ User ${session.sub} created in database on first request`);
            } catch (createError) {
                console.error('Failed to create user in database:', createError);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to create user profile'
                });
            }
        } else {
            // User exists - update last login time
            await User.findByIdAndUpdate(user._id, { lastLoginAt: new Date() });
        }

        // Attach user and clerk session to request
        req.user = user;
        req.clerkUserId = session.sub;
        req.session = session;
        
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        
        if (error.status === 401 || error.message?.includes('invalid') || error.message?.includes('expired')) {
            return res.status(401).json({
                success: false,
                message: 'Authentication failed - Invalid or expired token'
            });
        }
        
        return res.status(500).json({
            success: false,
            message: 'Authentication service error'
        });
    }
}

// Optional: Middleware to check if user is admin or has specific roles
export const requireRole = (roles) => {
    return async (req, res, next) => {
        try {
            const user = await clerk.users.getUser(req.clerkUserId);
            const userRoles = user.publicMetadata?.roles || [];
            
            const hasRole = roles.some(role => userRoles.includes(role));
            
            if (!hasRole) {
                return res.status(403).json({
                    success: false,
                    message: 'Insufficient permissions'
                });
            }
            
            next();
        } catch (error) {
            console.error('Role check error:', error);
            res.status(500).json({
                success: false,
                message: 'Error checking user permissions'
            });
        }
    };
};