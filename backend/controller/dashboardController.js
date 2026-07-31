import { dashboardService } from "../services/dashboardService.js";

/**
 * Get complete dashboard overview
 */
export async function getDashboardOverview(req, res) {
    const userId = req.user._id;

    try {
        const dashboardData = await dashboardService.getDashboardOverview(userId);

        return res.status(200).json({
            success: true,
            data: dashboardData,
        });
    } catch (error) {
        console.error("GetDashboardOverview Error: ", error);
        return res.status(500).json({
            success: false,
            message: "Dashboard Fetch failed",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
}

/**
 * Get monthly trends for charts
 */
export async function getMonthlyTrends(req, res) {
    const userId = req.user._id;
    const { months = 6 } = req.query;

    try {
        const trends = await dashboardService.getMonthlyTrends(userId, parseInt(months));

        return res.status(200).json({
            success: true,
            data: trends,
        });
    } catch (error) {
        console.error("GetMonthlyTrends Error: ", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch monthly trends",
        });
    }
}

/**
 * Get top spending categories
 */
export async function getTopSpendingCategories(req, res) {
    const userId = req.user._id;
    const { limit = 5, range = 'monthly' } = req.query;

    try {
        const categories = await dashboardService.getTopSpendingCategories(
            userId, 
            parseInt(limit),
            range
        );

        return res.status(200).json({
            success: true,
            data: categories,
        });
    } catch (error) {
        console.error("GetTopSpendingCategories Error: ", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch top spending categories",
        });
    }
}

/**
 * Get financial summary
 */
export async function getFinancialSummary(req, res) {
    const userId = req.user._id;

    try {
        const summary = await dashboardService.getFinancialSummary(userId);

        return res.status(200).json({
            success: true,
            data: summary,
        });
    } catch (error) {
        console.error("GetFinancialSummary Error: ", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch financial summary",
        });
    }
}

/**
 * Get cash flow forecast (NEW FEATURE)
 */
export async function getCashFlowForecast(req, res) {
    const userId = req.user._id;
    const { months = 3 } = req.query;

    try {
        const forecast = await dashboardService.getCashFlowForecast(userId, parseInt(months));

        return res.status(200).json({
            success: true,
            data: forecast,
        });
    } catch (error) {
        console.error("GetCashFlowForecast Error: ", error);
        return res.status(500).json({
            success: false,
            message: "Failed to generate cash flow forecast",
        });
    }
}