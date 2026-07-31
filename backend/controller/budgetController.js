import { budgetService } from "../services/budgetService.js";

/**
 * Set or update a budget for a category
 */
export async function setBudget(req, res) {
    const userId = req.user._id;
    const { category, amount, period, month, year } = req.body;

    // Validation
    if (!category || amount === undefined || amount === null) {
        return res.status(400).json({
            success: false,
            message: "Category and amount are required"
        });
    }

    if (amount <= 0) {
        return res.status(400).json({
            success: false,
            message: "Amount must be greater than 0"
        });
    }

    try {
        const budget = await budgetService.setBudget(userId, {
            category,
            amount: Number(amount),
            period: period || 'monthly',
            month: month || new Date().getMonth() + 1,
            year: year || new Date().getFullYear(),
        });

        res.status(201).json({
            success: true,
            message: "Budget set successfully",
            data: budget,
        });
    } catch (error) {
        console.error("SetBudget Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to set budget",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
}

/**
 * Get all budgets for current user
 */
export async function getUserBudgets(req, res) {
    const userId = req.user._id;
    const { month, year } = req.query;

    try {
        const budgets = await budgetService.getUserBudgets(
            userId,
            month ? parseInt(month) : undefined,
            year ? parseInt(year) : undefined
        );

        res.json({
            success: true,
            data: budgets,
        });
    } catch (error) {
        console.error("GetUserBudgets Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch budgets",
        });
    }
}

/**
 * Get budget alerts for current user
 */
export async function getBudgetAlerts(req, res) {
    const userId = req.user._id;

    try {
        const alerts = await budgetService.getBudgetAlerts(userId);

        res.json({
            success: true,
            data: alerts,
        });
    } catch (error) {
        console.error("GetBudgetAlerts Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch budget alerts",
        });
    }
}

/**
 * Update a budget
 */
export async function updateBudget(req, res) {
    const userId = req.user._id;
    const { id } = req.params;
    const { amount, period, alertThreshold, alertsEnabled } = req.body;

    try {
        // First find the budget to ensure it belongs to the user
        const existingBudget = await budgetService.getBudgetById(id, userId);
        if (!existingBudget) {
            return res.status(404).json({
                success: false,
                message: "Budget not found"
            });
        }

        const updatedBudget = await budgetService.updateBudget(id, userId, {
            amount: amount !== undefined ? Number(amount) : existingBudget.amount,
            period: period || existingBudget.period,
            alertThreshold: alertThreshold !== undefined ? Number(alertThreshold) : existingBudget.alertThreshold,
            alertsEnabled: alertsEnabled !== undefined ? alertsEnabled : existingBudget.alertsEnabled,
        });

        res.json({
            success: true,
            message: "Budget updated successfully",
            data: updatedBudget,
        });
    } catch (error) {
        console.error("UpdateBudget Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update budget",
        });
    }
}

/**
 * Delete a budget
 */
export async function deleteBudget(req, res) {
    const userId = req.user._id;
    const { id } = req.params;

    try {
        const deletedBudget = await budgetService.deleteBudget(id, userId);

        if (!deletedBudget) {
            return res.status(404).json({
                success: false,
                message: "Budget not found"
            });
        }

        res.json({
            success: true,
            message: "Budget deleted successfully",
            data: deletedBudget,
        });
    } catch (error) {
        console.error("DeleteBudget Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete budget",
        });
    }
}

/**
 * Get budget spending progress for a specific category
 */
export async function getBudgetProgress(req, res) {
    const userId = req.user._id;
    const { category } = req.params;
    const { month, year } = req.query;

    try {
        const progress = await budgetService.getBudgetProgress(
            userId,
            category,
            month ? parseInt(month) : undefined,
            year ? parseInt(year) : undefined
        );

        if (!progress) {
            return res.status(404).json({
                success: false,
                message: "Budget not found for this category"
            });
        }

        res.json({
            success: true,
            data: progress,
        });
    } catch (error) {
        console.error("GetBudgetProgress Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch budget progress",
        });
    }
}