import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    clerkUserId: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    // Store additional Clerk metadata (flexible schema)
    clerkMetadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },
    // Custom user preferences
    preferences: {
        currency: {
            type: String,
            default: 'USD',
            enum: ['USD', 'EUR', 'GBP', 'MAD', 'CAD'],
        },
        theme: {
            type: String,
            default: 'light',
            enum: ['light', 'dark', 'system'],
        },
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    lastLoginAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

// Add virtual field for full name
userSchema.virtual('fullName').get(function() {
    return this.name;
});

// Index for efficient queries
userSchema.index({ clerkUserId: 1, email: 1 });

// Ensure virtuals are included in JSON output
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;