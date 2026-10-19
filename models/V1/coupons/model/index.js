const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema(
    {
        code: { type: String, required: true, unique: true, uppercase: true, trim: true },
        description: { type: String, trim: true },
        discountType: { type: String, enum: ['percentage', 'flat'], required: true },
        discountValue: { type: Number, required: true, min: 1 },
        maxDiscount: { type: Number, min: 0 },
        minOrderAmount: { type: Number, default: 0, min: 0 },
        startDate: { type: Date, default: Date.now },
        expiryDate: { type: Date, required: true },
        usageLimit: { type: Number, min: 1 },
        usedCount: { type: Number, default: 0, min: 0 },
        perUserLimit: { type: Number, default: 1, min: 1 },
        status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    },
    { timestamps: true }
)

module.exports = mongoose.model('Coupon', couponSchema)