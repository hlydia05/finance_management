import express from 'express';
import { getCurrentUser, loginUser, registerUser, updatePassword, updateProfile } from '../controller/userController.js';
import authMiddleware from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

//protected routes

userRouter.use(authMiddleware);
userRouter.get("/me", getCurrentUser);
userRouter.put("/profile", updateProfile);
userRouter.put("/password", updatePassword);

userRouter.use("/incomes", incomeRouter);
userRouter.use("/expenses", expenseRouter);
userRouter.use("/dashboard", dashboardRouter);

export default userRouter;