import express from 'express';
import authMiddleware from '../middleware/auth.js';
import {
    setBudget,
    getUserBudgets,
    getBudgetAlerts,
    updateBudget,
    deleteBudget,
    getBudgetProgress,
} from '../controller/budgetController.js';

const budgetRouter = express.Router();

// All budget routes are protected
budgetRouter.use(authMiddleware);

// Main budget routes
budgetRouter.post("/set", setBudget);
budgetRouter.get("/all", getUserBudgets);
budgetRouter.get("/alerts", getBudgetAlerts);
budgetRouter.get("/progress/:category", getBudgetProgress);

// Individual budget operations
budgetRouter.put("/update/:id", updateBudget);
budgetRouter.delete("/delete/:id", deleteBudget);

export default budgetRouter;