import budgetModel from "../model/budgetModel.js";
import expenseModel from "../model/expenseModel.js";

export const budgetService = {
    /**
     * Create or update a budget
     */
    async setBudget(userId, budgetData) {
        const { category, amount, period, month, year } = budgetData;
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        const budget = await budgetModel.findOneAndUpdate(
            {
                userId,
                category,
                month: month || currentMonth,
                year: year || currentYear,
            },
            {
                amount: Number(amount), // FIXED: Ensure amount is a number
                period: period || 'monthly',
                userId,
                category,
                month: month || currentMonth,
                year: year || currentYear,
            },
            { new: true, upsert: true, runValidators: true }
        );

        // Update spent amount
        await this.updateBudgetSpent(userId, category, budget.month, budget.year);

        return budget;
    },

    /**
     * Update spent amount for a budget
     */
    async updateBudgetSpent(userId, category, month, year) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        // Set end date to end of day
        endDate.setHours(23, 59, 59, 999);

        const expenses = await expenseModel.find({
            userId,
            category,
            date: { $gte: startDate, $lte: endDate },
        });

        const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

        await budgetModel.findOneAndUpdate(
            {
                userId,
                category,
                month,
                year,
            },
            { spent: totalSpent },
            { new: true }
        );
    },

    /**
     * Get all budgets for a user
     */
    async getUserBudgets(userId, month, year) {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        const budgets = await budgetModel.find({
            userId,
            month: month || currentMonth,
            year: year || currentYear,
        }).lean();

        // Add status to each budget
        return budgets.map(budget => ({
            ...budget,
            status: this.getBudgetStatus(budget),
            remaining: budget.amount - budget.spent,
            percentUsed: budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0,
        }));
    },

    /**
     * Get a single budget by ID
     */
    async getBudgetById(budgetId, userId) {
        const budget = await budgetModel.findOne({
            _id: budgetId,
            userId,
        }).lean();

        if (!budget) return null;

        return {
            ...budget,
            status: this.getBudgetStatus(budget),
            remaining: budget.amount - budget.spent,
            percentUsed: budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0,
        };
    },

    /**
     * Update a budget
     */
    async updateBudget(budgetId, userId, updateData) {
        // Convert amount to number if present
        if (updateData.amount !== undefined) {
            updateData.amount = Number(updateData.amount);
        }
        if (updateData.alertThreshold !== undefined) {
            updateData.alertThreshold = Number(updateData.alertThreshold);
        }

        const budget = await budgetModel.findOneAndUpdate(
            { _id: budgetId, userId },
            updateData,
            { new: true, runValidators: true }
        );

        if (!budget) return null;

        // Update spent amount if category or date changed
        await this.updateBudgetSpent(userId, budget.category, budget.month, budget.year);

        return {
            ...budget.toObject(),
            status: this.getBudgetStatus(budget),
            remaining: budget.amount - budget.spent,
            percentUsed: budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0,
        };
    },

    /**
     * Get budget status
     */
    getBudgetStatus(budget) {
        const percentUsed = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;
        if (percentUsed >= 100) return 'exceeded';
        if (percentUsed >= 90) return 'danger';
        if (percentUsed >= budget.alertThreshold) return 'warning';
        return 'good';
    },

    /**
     * Get budget alerts
     */
    async getBudgetAlerts(userId) {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        const budgets = await this.getUserBudgets(userId, currentMonth, currentYear);
        
        return budgets
            .filter(b => b.alertsEnabled && b.percentUsed >= b.alertThreshold)
            .map(b => ({
                category: b.category,
                spent: b.spent,
                budget: b.amount,
                percentUsed: b.percentUsed,
                status: b.status,
                remaining: b.remaining,
                message: b.status === 'exceeded' 
                    ? `⚠️ Budget exceeded for ${b.category}! Spent $${b.spent.toFixed(2)} of $${b.amount.toFixed(2)}`
                    : `📊 ${b.category} is at ${Math.round(b.percentUsed)}% of budget ($${b.spent.toFixed(2)} of $${b.amount.toFixed(2)})`,
            }));
    },

    /**
     * Delete a budget
     */
    async deleteBudget(budgetId, userId) {
        const budget = await budgetModel.findOneAndDelete({
            _id: budgetId,
            userId,
        });
        return budget;
    },

    /**
     * Get budget progress for a specific category
     */
    async getBudgetProgress(userId, category, month, year) {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        const budget = await budgetModel.findOne({
            userId,
            category,
            month: month || currentMonth,
            year: year || currentYear,
        }).lean();

        if (!budget) return null;

        // Get all expenses for this category in the period
        const startDate = new Date(budget.year, budget.month - 1, 1);
        const endDate = new Date(budget.year, budget.month, 0);
        endDate.setHours(23, 59, 59, 999);

        const expenses = await expenseModel.find({
            userId,
            category,
            date: { $gte: startDate, $lte: endDate },
        }).sort({ date: -1 }).lean();

        return {
            ...budget,
            status: this.getBudgetStatus(budget),
            remaining: budget.amount - budget.spent,
            percentUsed: budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0,
            transactions: expenses.map(e => ({
                id: e._id,
                description: e.description,
                amount: e.amount,
                date: e.date,
            })),
            transactionCount: expenses.length,
        };
    },

    /**
     * Get budget summary (all categories overview)
     */
    async getBudgetSummary(userId, month, year) {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        const budgets = await this.getUserBudgets(
            userId,
            month || currentMonth,
            year || currentYear
        );

        const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
        const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
        const totalRemaining = totalBudget - totalSpent;

        // Count budgets by status
        const statusCount = budgets.reduce((acc, b) => {
            acc[b.status] = (acc[b.status] || 0) + 1;
            return acc;
        }, {});

        return {
            totalBudget,
            totalSpent,
            totalRemaining,
            overallPercentUsed: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0,
            budgetCount: budgets.length,
            statusCount,
            budgets,
            month: month || currentMonth,
            year: year || currentYear,
        };
    }
};