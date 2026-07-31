import incomeModel from "../model/incomeModel.js";
import getDateRange from "../utils/dataFilter.js";

export const incomeService = {
    // Add income
    async addIncome(userId, incomeData) {
        const { description, amount, category, date } = incomeData;
        
        const newIncome = new incomeModel({
            userId,
            description,
            amount,
            category,
            date: new Date(date),
        });
        
        await newIncome.save();
        return newIncome;
    },

    // Get all incomes
    async getAllIncome(userId) {
        const incomes = await incomeModel.find({ userId }).sort({ date: -1 });
        return incomes;
    },

    // Update income
    async updateIncome(incomeId, userId, updateData) {
        const { description, amount } = updateData;
        
        const updatedIncome = await incomeModel.findOneAndUpdate(
            {
                _id: incomeId,
                userId,
            },
            { description, amount },
            { new: true, runValidators: true }
        );

        if (!updatedIncome) {
            throw new Error('Income not found');
        }

        return updatedIncome;
    },

    // Delete income
    async deleteIncome(incomeId, userId) {
        const income = await incomeModel.findOneAndDelete({
            _id: incomeId,
            userId
        });

        if (!income) {
            throw new Error('Income not found');
        }

        return income;
    },

    // Get income overview
    async getIncomeOverview(userId, range = 'monthly') {
        const { start, end } = getDateRange(range);

        const incomes = await incomeModel
            .find({
                userId,
                date: { $gte: start, $lte: end },
            })
            .sort({ date: -1 });

        const totalIncome = incomes.reduce((acc, cur) => acc + cur.amount, 0);
        const averageIncome = incomes.length > 0 ? totalIncome / incomes.length : 0;
        const numberOfTransactions = incomes.length;
        const recentTransactions = incomes.slice(0, 9);

        return {
            totalIncome,
            averageIncome,
            numberOfTransactions,
            recentTransactions,
            range
        };
    },

    // Prepare income data for Excel export
    async prepareExcelData(userId) {
        const incomes = await incomeModel.find({ userId }).sort({ date: -1 });
        
        const plainData = incomes.map((inc) => ({
            Description: inc.description,
            Amount: inc.amount,
            Category: inc.category,
            Date: new Date(inc.date).toLocaleDateString(),
        }));

        return plainData;
    }
};