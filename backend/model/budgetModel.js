import mongoose from "mongoose";

/**
 * Budget model for setting spending limits per category
 */
const budgetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        index: true,
    },
    category: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    period: {
        type: String,
        enum: ['monthly', 'yearly'],
        default: 'monthly',
    },
    month: {
        type: Number,
        min: 1,
        max: 12,
        default: () => new Date().getMonth() + 1,
    },
    year: {
        type: Number,
        default: () => new Date().getFullYear(),
    },
    spent: {
        type: Number,
        default: 0,
    },
    alertsEnabled: {
        type: Boolean,
        default: true,
    },
    alertThreshold: {
        type: Number,
        min: 0,
        max: 100,
        default: 80, // Alert at 80% of budget
    },
}, {
    timestamps: true,
});

// Compound index for unique budget per category, month, year
budgetSchema.index({ userId: 1, category: 1, month: 1, year: 1 }, { unique: true });

const budgetModel = mongoose.models.budget || mongoose.model("budget", budgetSchema);
export default budgetModel;