import expenseModel from "../model/expenseModel.js";
import getDateRange from "../utils/dataFilter.js";

export const expenseService = {
    // Add expense
    async addExpense(userId, expenseData) {
        const { description, amount, category, date } = expenseData;
        
        const newExpense = new expenseModel({
            userId,
            description,
            amount,
            category,
            date: new Date(date),
        });
        
        await newExpense.save();
        return newExpense;
    },

    // Get all expenses
    async getAllExpense(userId) {
        const expenses = await expenseModel.find({ userId }).sort({ date: -1 });
        return expenses;
    },

    // Update expense
    async updateExpense(expenseId, userId, updateData) {
        const { description, amount } = updateData;
        
        const updatedExpense = await expenseModel.findOneAndUpdate(
            {
                _id: expenseId,
                userId,
            },
            { description, amount },
            { new: true, runValidators: true }
        );

        if (!updatedExpense) {
            throw new Error('Expense not found');
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

        const totalExpense = expenses.reduce((acc, cur) => acc + cur.amount, 0);
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
    }
};