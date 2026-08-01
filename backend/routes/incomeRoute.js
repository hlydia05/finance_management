import express from 'express';
import authMiddleware from '../middleware/auth.js';
import {
    addIncome,
    getAllIncome,
    updateIncome,
    deleteIncome,
    downloadIncomeExcel,
    getIncomeOverview
} from '../controller/incomeController.js';

const incomeRouter = express.Router();

// All routes are protected
incomeRouter.use(authMiddleware);

incomeRouter.post("/add", addIncome);
incomeRouter.get("/all", getAllIncome);
incomeRouter.put("/update/:id", updateIncome);
incomeRouter.delete("/delete/:id", deleteIncome);
incomeRouter.get("/downloadexcel", downloadIncomeExcel);
incomeRouter.get("/overview", getIncomeOverview);

export default incomeRouter;