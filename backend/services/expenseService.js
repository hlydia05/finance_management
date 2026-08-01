import expenseModel from "../model/expenseModel.js";
import getDateRange from "../utils/dataFilter.js";
import { budgetService } from "./budgetService.js";

export const expenseService = {
    // Add expense
    async addExpense(userId, expenseData) {
        const { description, amount, category, date } = expenseData;

        const expenseDate = new Date(date);
        const newExpense = new expenseModel({
            userId,
            description,
            amount: Number(amount),
            category,
            date: expenseDate,
        });

        await newExpense.save();

        // Update budget spent amount
        await this.updateBudgetSpent(userId, category, expenseDate);

        return newExpense;
    },

    // Get all expenses
    async getAllExpense(userId) {
        const expenses = await expenseModel.find({ userId }).sort({ date: -1 });
        return expenses;
    },

    // Update expense
    async updateExpense(expenseId, userId, updateData) {
        const { description, amount, category } = updateData;

        // Get the original expense to know the original category/date
        const originalExpense = await expenseModel.findOne({ _id: expenseId, userId });
        if (!originalExpense) {
            throw new Error('Expense not found');
        }

        // Prepare update fields
        const updateFields = { description, amount: Number(amount) };
        if (category) updateFields.category = category;

        const updatedExpense = await expenseModel.findOneAndUpdate(
            {
                _id: expenseId,
                userId,
            },
            updateFields,
            { new: true, runValidators: true }
        );

        if (!updatedExpense) {
            throw new Error('Expense not found');
        }

        // Update budget spent amount for the original category
        await this.updateBudgetSpent(userId, originalExpense.category, originalExpense.date);

        // If category changed, update budget for the new category too
        if (category && category !== originalExpense.category) {
            await this.updateBudgetSpent(userId, category, updatedExpense.date);
        }

        return updatedExpense;
    },

    // Delete expense
    async deleteExpense(expenseId, userId) {
        const expense = await expenseModel.findOneAndDelete({
            _id: expenseId,
            userId
        });

        if (!expense) {
            throw new Error('Expense not found');
        }

        // Update budget spent amount for the category
        await this.updateBudgetSpent(userId, expense.category, expense.date);

        return expense;
    },

    // Get expense overview
    async getExpenseOverview(userId, range = 'monthly') {
        const { start, end } = getDateRange(range);

        const expenses = await expenseModel
            .find({
                userId,
                date: { $gte: start, $lte: end },
            })
            .sort({ date: -1 });

        const totalExpense = expenses.reduce((acc, cur) => acc + Number(cur.amount || 0), 0);
        const averageExpense = expenses.length > 0 ? totalExpense / expenses.length : 0;
        const numberOfTransactions = expenses.length;
        const recentTransactions = expenses.slice(0, 5);

        return {
            totalExpense,
            averageExpense,
            numberOfTransactions,
            recentTransactions,
            range
        };
    },

    // Prepare expense data for Excel export
    async prepareExcelData(userId) {
        const expenses = await expenseModel.find({ userId }).sort({ date: -1 });

        const plainData = expenses.map((exp) => ({
            Description: exp.description,
            Amount: exp.amount,
            Category: exp.category,
            Date: new Date(exp.date).toLocaleDateString(),
        }));

        return plainData;
    },

    // Helper: recompute a budget's "spent" total for the month/year that a given
    // expense date falls in. Delegates to budgetService so there's a single
    // source of truth for how "spent" is calculated. If the user has no budget
    // set for that category/month, budgetService's update simply matches nothing
    // and is a no-op, so this is always safe to call.
    async updateBudgetSpent(userId, category, date) {
        const d = new Date(date);
        const month = d.getMonth() + 1;
        const year = d.getFullYear();
        await budgetService.updateBudgetSpent(userId, category, month, year);
    },
};
