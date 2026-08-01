import express from 'express';
import { 
    getCurrentUser, 
    updateProfile, 
    getUserStats 
} from '../controller/userController.js';
import authMiddleware from '../middleware/auth.js';

const userRouter = express.Router();

// Public routes (none - registration handled by Clerk)

// Protected routes
userRouter.use(authMiddleware);
userRouter.get("/me", getCurrentUser);
userRouter.put("/profile", updateProfile);
userRouter.get("/stats", getUserStats);

export default userRouter;