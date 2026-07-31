import expenseModel from "../model/expenseModel.js";
import getDateRange from "../utils/dataFilter.js";
import budgetModel from "../model/budgetModel.js"; // ADDED

export const expenseService = {
    // Add expense
    async addExpense(userId, expenseData) {
        const { description, amount, category, date } = expenseData;
        
        const expenseDate = new Date(date);
        const newExpense = new expenseModel({
            userId,
            description,
            amount,
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
        const { description, amount } = updateData;
        
        // Get the original expense to know the category
        const originalExpense = await expenseModel.findOne({ _id: expenseId, userId });
        if (!originalExpense) {
            throw new Error('Expense not found');
        }
        
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

        // Update budget spent amount for the category
        await this.updateBudgetSpent(userId, originalExpense.category, originalExpense.date);

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

    // NEW: Helper method to update budget spent
    // Update expense - FIXED
async updateExpense(expenseId, userId, updateData) {
    const { description, amount, category } = updateData; // Added category
    
    // Get the original expense
    const originalExpense = await expenseModel.findOne({ _id: expenseId, userId });
    if (!originalExpense) {
        throw new Error('Expense not found');
    }
    
    // Prepare update data
    const updateFields = { description, amount };
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

    // Update budget for original category
    await this.updateBudgetSpent(userId, originalExpense.category, originalExpense.date);
    
    // If category changed, update budget for new category too
    if (category && category !== originalExpense.category) {
        await this.updateBudgetSpent(userId, category, updatedExpense.date);
    }

    return updatedExpense;
}
};