import XLSX from "xlsx";
import { expenseService } from "../services/expenseService.js";

// Add expense
export async function addExpense(req, res) {
    const userId = req.user._id;
    const { description, amount, category, date } = req.body;

    // Validation
    if (!description || !amount || !category || !date) {
        return res.status(400).json({
            success: false,
            message: "All fields are required",
        });
    }

    try {
        await expenseService.addExpense(userId, { description, amount, category, date });
        
        res.status(201).json({
            success: true,
            message: "Expense added successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
}

// Get all expenses
export async function getAllExpense(req, res) {
    const userId = req.user._id;

    try {
        const expenses = await expenseService.getAllExpense(userId);
        res.json(expenses);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
}

// Update expense
export async function updateExpense(req, res) {
    const { id } = req.params;
    const userId = req.user._id;
    const { description, amount } = req.body;

    // Validation
    if (!description || !amount) {
        return res.status(400).json({
            success: false,
            message: "Description and amount are required",
        });
    }

    try {
        const updatedExpense = await expenseService.updateExpense(
            id,
            userId,
            { description, amount }
        );

        res.json({
            success: true,
            message: "Expense updated successfully",
            data: updatedExpense,
        });
    } catch (error) {
        if (error.message === 'Expense not found') {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
}

// Delete expense
export async function deleteExpense(req, res) {
    const { id } = req.params;
    const userId = req.user._id;

    try {
        await expenseService.deleteExpense(id, userId);

        res.json({
            success: true,
            message: "Expense deleted successfully",
        });
    } catch (error) {
        if (error.message === 'Expense not found') {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
}

// Download data in Excel sheet
export async function downloadExpenseExcel(req, res) {
    const userId = req.user._id;

    try {
        const plainData = await expenseService.prepareExcelData(userId);

        const worksheet = XLSX.utils.json_to_sheet(plainData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

        // Write the workbook straight to a buffer - no temp file on disk,
        // so there's nothing to clean up and no filesystem permission issues.
        const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

        const fileName = `expense_details_${Date.now()}.xlsx`;
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
        res.send(buffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
}

// Expense overview
export async function getExpenseOverview(req, res) {
    try {
        const userId = req.user._id;
        const { range = "monthly" } = req.query;

        const overviewData = await expenseService.getExpenseOverview(userId, range);

        res.json({
            success: true,
            data: overviewData,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
}