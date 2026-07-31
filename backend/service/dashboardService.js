import incomeModel from "../model/incomeModel.js";
import expenseModel from "../model/expenseModel.js";

export const dashboardService = {
    // Get dashboard overview data
    async getDashboardOverview(userId) {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Find income with userId and date between start of month and now
        const incomes = await incomeModel.find({
            userId,
            date: { $gte: startOfMonth, $lte: now },
        }).lean();

        // Find expense with userId and date between start of month and now
        const expenses = await expenseModel.find({
            userId,
            date: { $gte: startOfMonth, $lte: now },
        }).lean();

        // Calculate monthly totals
        const monthlyIncome = incomes.reduce((acc, cur) => acc + Number(cur.amount || 0), 0);
        const monthlyExpense = expenses.reduce((acc, cur) => acc + Number(cur.amount || 0), 0);
        const savings = monthlyIncome - monthlyExpense;
        const savingsRate = monthlyIncome === 0 ? 0 : Math.round((savings / monthlyIncome) * 100);

        // Recent transactions (combine incomes and expenses)
        const recentTransactions = [
            ...incomes.map((i) => ({ ...i, type: "income" })),
            ...expenses.map((e) => ({ ...e, type: "expense" })),
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Calculate spend by category
        const spendByCategory = {};
        for (const exp of expenses) {
            const cat = exp.category || "Other";
            spendByCategory[cat] = (spendByCategory[cat] || 0) + Number(exp.amount || 0);
        }

        // Expense distribution for charts
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
            recentTransactions: recentTransactions.slice(0, 10), // Limit to 10 most recent
            spendByCategory,
            expenseDistribution,
            // Additional useful data
            totalTransactions: recentTransactions.length,
            incomeCount: incomes.length,
            expenseCount: expenses.length,
        };
    },

    // Get monthly trends (for charts)
    async getMonthlyTrends(userId, months = 6) {
        const now = new Date();
        const trends = [];

        for (let i = months - 1; i >= 0; i--) {
            const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
            const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);

            const incomes = await incomeModel.find({
                userId,
                date: { $gte: startOfMonth, $lte: endOfMonth },
            }).lean();

            const expenses = await expenseModel.find({
                userId,
                date: { $gte: startOfMonth, $lte: endOfMonth },
            }).lean();

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

    // Get top spending categories
    async getTopSpendingCategories(userId, limit = 5) {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const expenses = await expenseModel.find({
            userId,
            date: { $gte: startOfMonth, $lte: now },
        }).lean();

        const spendByCategory = {};
        for (const exp of expenses) {
            const cat = exp.category || "Other";
            spendByCategory[cat] = (spendByCategory[cat] || 0) + Number(exp.amount || 0);
        }

        const sortedCategories = Object.entries(spendByCategory)
            .map(([category, amount]) => ({ category, amount }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, limit);

        return sortedCategories;
    },

    // Get financial summary (all-time)
    async getFinancialSummary(userId) {
        const [allIncomes, allExpenses] = await Promise.all([
            incomeModel.find({ userId }).lean(),
            expenseModel.find({ userId }).lean(),
        ]);

        const totalIncome = allIncomes.reduce((acc, cur) => acc + Number(cur.amount || 0), 0);
        const totalExpense = allExpenses.reduce((acc, cur) => acc + Number(cur.amount || 0), 0);
        const netSavings = totalIncome - totalExpense;

        // Get first transaction date
        const firstTransaction = await incomeModel.findOne({ userId })
            .sort({ date: 1 })
            .lean();
        
        const firstExpense = await expenseModel.findOne({ userId })
            .sort({ date: 1 })
            .lean();

        const startDate = firstTransaction?.date || firstExpense?.date || new Date();

        return {
            totalIncome,
            totalExpense,
            netSavings,
            totalTransactions: allIncomes.length + allExpenses.length,
            startDate,
            monthsTracked: Math.max(1, Math.floor((Date.now() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24 * 30))),
        };
    }
};