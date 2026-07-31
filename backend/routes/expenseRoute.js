import express from 'express';
import authMiddleware from '../middleware/auth.js';
import {
    addExpense,
    getAllExpense,
    updateExpense,
    deleteExpense,
    downloadExpenseExcel,
    getExpenseOverview
} from '../controllers/expenseController.js';

const expenseRouter = express.Router();

// All routes are protected
expenseRouter.use(authMiddleware);

expenseRouter.post("/add", addExpense);
expenseRouter.get("/all", getAllExpense);
expenseRouter.put("/update/:id", updateExpense);
expenseRouter.delete("/delete/:id", deleteExpense);
expenseRouter.get("/downloadexcel", downloadExpenseExcel);
expenseRouter.get("/overview", getExpenseOverview);

export default expenseRouter;