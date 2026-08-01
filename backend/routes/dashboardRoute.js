import express from 'express';
import authMiddleware from '../middleware/auth.js';
import {
    getDashboardOverview,
    getMonthlyTrends,
    getTopSpendingCategories,
    getFinancialSummary
} from '../controller/dashboardController.js';

const dashboardRouter = express.Router();

// All routes are protected
dashboardRouter.use(authMiddleware);

dashboardRouter.get("/", getDashboardOverview);
dashboardRouter.get("/trends", getMonthlyTrends);
dashboardRouter.get("/top-categories", getTopSpendingCategories);
dashboardRouter.get("/summary", getFinancialSummary);

export default dashboardRouter;