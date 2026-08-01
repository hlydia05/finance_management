import XLSX from "xlsx";
import { incomeService } from "../services/incomeService.js";

// Add income
export async function addIncome(req, res) {
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
        await incomeService.addIncome(userId, { description, amount, category, date });
        
        res.status(201).json({
            success: true,
            message: "Income added successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
}

// Get all incomes
export async function getAllIncome(req, res) {
    const userId = req.user._id;

    try {
        const incomes = await incomeService.getAllIncome(userId);
        res.json(incomes);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
}

// Update income
export async function updateIncome(req, res) {
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
        const updatedIncome = await incomeService.updateIncome(
            id,
            userId,
            { description, amount }
        );

        res.json({
            success: true,
            message: "Income updated successfully",
            data: updatedIncome,
        });
    } catch (error) {
        if (error.message === 'Income not found') {
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

// Delete income
export async function deleteIncome(req, res) {
    const { id } = req.params;
    const userId = req.user._id;

    try {
        await incomeService.deleteIncome(id, userId);

        res.json({
            success: true,
            message: "Income deleted successfully",
        });
    } catch (error) {
        if (error.message === 'Income not found') {
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
export async function downloadIncomeExcel(req, res) {
    const userId = req.user._id;

    try {
        const plainData = await incomeService.prepareExcelData(userId);

        const worksheet = XLSX.utils.json_to_sheet(plainData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Income");

        // Write the workbook straight to a buffer - no temp file on disk,
        // so there's nothing to clean up and no filesystem permission issues.
        const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

        const fileName = `income_details_${Date.now()}.xlsx`;
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

// Income overview
export async function getIncomeOverview(req, res) {
    try {
        const userId = req.user._id;
        const { range = "monthly" } = req.query;

        const overviewData = await incomeService.getIncomeOverview(userId, range);

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