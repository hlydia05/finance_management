import incomeModel from "../model/incomeModel.js";
import expenseModel from "../model/expenseModel.js";
import getDateRange from "../utils/dataFilter.js";

export const dashboardService = {
    /**
     * Get comprehensive dashboard overview for current month
     */
    async getDashboardOverview(userId) {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const [incomes, expenses] = await Promise.all([
            incomeModel.find({
                userId,
                date: { $gte: startOfMonth, $lte: now },
            }).lean(),
            expenseModel.find({
                userId,
                date: { $gte: startOfMonth, $lte: now },
            }).lean(),
        ]);

        const monthlyIncome = incomes.reduce((acc, cur) => acc + Number(cur.amount || 0), 0);
        const monthlyExpense = expenses.reduce((acc, cur) => acc + Number(cur.amount || 0), 0);
        const savings = monthlyIncome - monthlyExpense;
        const savingsRate = monthlyIncome === 0 ? 0 : Math.round((savings / monthlyIncome) * 100);

        // Recent transactions
        const recentTransactions = [
            ...incomes.map((i) => ({ ...i, type: "income" })),
            ...expenses.map((e) => ({ ...e, type: "expense" })),
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Spend by category
        const spendByCategory = expenses.reduce((acc, exp) => {
            const cat = exp.category || "Other";
            acc[cat] = (acc[cat] || 0) + Number(exp.amount || 0);
            return acc;
        }, {});

        const expenseDistribution = Object.entries(spendByCategory).map(([category, amount]) => ({
            category,
            amount,
            percent: monthlyExpense === 0 ? 0 : Math.round((amount / monthlyExpense) * 100),
        }));

        return {
            monthlyIncome,
            monthlyExpense,
            savings,
            savingsRate,
            recentTransactions: recentTransactions.slice(0, 10),
            spendByCategory,
            expenseDistribution,
            totalTransactions: recentTransactions.length,
            incomeCount: incomes.length,
            expenseCount: expenses.length,
        };
    },

    /**
     * Get monthly trends for chart visualization
     */
    async getMonthlyTrends(userId, months = 6) {
        const now = new Date();
        const trends = [];

        for (let i = months - 1; i >= 0; i--) {
            const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
            const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);

            const [incomes, expenses] = await Promise.all([
                incomeModel.find({
                    userId,
                    date: { $gte: startOfMonth, $lte: endOfMonth },
                }).lean(),
                expenseModel.find({
                    userId,
                    date: { $gte: startOfMonth, $lte: endOfMonth },
                }).lean(),
            ]);

            const monthlyIncome = incomes.reduce((acc, cur) => acc + Number(cur.amount || 0), 0);
            const monthlyExpense = expenses.reduce((acc, cur) => acc + Number(cur.amount || 0), 0);

            trends.push({
                month: startOfMonth.toLocaleString('default', { month: 'short', year: 'numeric' }),
                income: monthlyIncome,
                expense: monthlyExpense,
                savings: monthlyIncome - monthlyExpense,
            });
        }

        return trends;
    },

    /**
     * Get top spending categories with optional range filter
     */
    async getTopSpendingCategories(userId, limit = 5, range = 'monthly') {
        const { start, end } = getDateRange(range);

        const expenses = await expenseModel.find({
            userId,
            date: { $gte: start, $lte: end },
        }).lean();

        const spendByCategory = expenses.reduce((acc, exp) => {
            const cat = exp.category || "Other";
            acc[cat] = (acc[cat] || 0) + Number(exp.amount || 0);
            return acc;
        }, {});

        return Object.entries(spendByCategory)
            .map(([category, amount]) => ({ category, amount }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, limit);
    },

    /**
     * Get comprehensive financial summary (all-time)
     */
    async getFinancialSummary(userId) {
        const [allIncomes, allExpenses] = await Promise.all([
            incomeModel.find({ userId }).lean(),
            expenseModel.find({ userId }).lean(),
        ]);

        const totalIncome = allIncomes.reduce((acc, cur) => acc + Number(cur.amount || 0), 0);
        const totalExpense = allExpenses.reduce((acc, cur) => acc + Number(cur.amount || 0), 0);
        const netSavings = totalIncome - totalExpense;
        const savingsRate = totalIncome === 0 ? 0 : Math.round((netSavings / totalIncome) * 100);

        // Get first transaction date
        const firstIncome = await incomeModel.findOne({ userId })
            .sort({ date: 1 })
            .lean();
        const firstExpense = await expenseModel.findOne({ userId })
            .sort({ date: 1 })
            .lean();

        const startDate = firstIncome?.date || firstExpense?.date || new Date();
        const monthsTracked = Math.max(1, Math.floor(
            (Date.now() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24 * 30)
        ));

        return {
            totalIncome,
            totalExpense,
            netSavings,
            savingsRate,
            totalTransactions: allIncomes.length + allExpenses.length,
            startDate,
            monthsTracked,
            averageMonthlyIncome: monthsTracked > 0 ? totalIncome / monthsTracked : 0,
            averageMonthlyExpense: monthsTracked > 0 ? totalExpense / monthsTracked : 0,
        };
    },

    /**
     * Generate cash flow forecast (NEW FEATURE)
     */
    async getCashFlowForecast(userId, months = 3) {
        const now = new Date();
        const forecast = [];

        // Get average monthly income and expenses from last 6 months
        const last6Months = await this.getMonthlyTrends(userId, 6);
        
        if (last6Months.length === 0) {
            return { message: "Insufficient data for forecast" };
        }

        const avgMonthlyIncome = last6Months.reduce((sum, m) => sum + m.income, 0) / last6Months.length;
        const avgMonthlyExpense = last6Months.reduce((sum, m) => sum + m.expense, 0) / last6Months.length;
        const avgSavings = avgMonthlyIncome - avgMonthlyExpense;

        let currentBalance = await this.getCurrentBalance(userId);

        for (let i = 1; i <= months; i++) {
            const futureDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
            currentBalance += avgSavings;
            
            forecast.push({
                month: futureDate.toLocaleString('default', { month: 'short', year: 'numeric' }),
                projectedIncome: avgMonthlyIncome,
                projectedExpense: avgMonthlyExpense,
                projectedSavings: avgSavings,
                projectedBalance: currentBalance,
            });
        }

        return {
            forecast,
            assumptions: {
                basedOnMonths: 6,
                avgMonthlyIncome,
                avgMonthlyExpense,
                avgMonthlySavings: avgSavings,
                currentBalance,
                confidence: last6Months.length >= 6 ? 'High' : 'Low',
            }
        };
    },

    /**
     * Get current balance (helper method)
     */
    async getCurrentBalance(userId) {
        const [incomes, expenses] = await Promise.all([
            incomeModel.find({ userId }).lean(),
            expenseModel.find({ userId }).lean(),
        ]);

        const totalIncome = incomes.reduce((sum, i) => sum + Number(i.amount || 0), 0);
        const totalExpense = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
        
        return totalIncome - totalExpense;
    }
};