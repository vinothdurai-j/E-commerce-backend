const Coupon = require('../model/index')
const Order = require('../../orders/model/index')

const throwError = (message, statusCode) => {
    const error = new Error(message)
    error.statusCode = statusCode
    throw error
}

// Discount calculate
const calculateDiscount = (coupon, amount) => {
    let discount =
        coupon.discountType === 'percentage'
            ? (amount * coupon.discountValue) / 100
            : coupon.discountValue

    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount)
    discount = Math.min(discount, amount) 
    return Math.round(discount * 100) / 100
}

// Coupon valid-a 
const checkCoupon = async (code, userId, amount) => {
    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() })
    if (!coupon) throwError('Invalid coupon code', 404)
    if (coupon.status !== 'active') throwError('Coupon is not active', 400)

    const now = new Date()
    if (coupon.startDate > now) throwError('Coupon is not started yet', 400)
    if (coupon.expiryDate < now) throwError('Coupon has expired', 400)

    if (amount < coupon.minOrderAmount) {
        throwError(`Minimum order amount is ₹${coupon.minOrderAmount}`, 400)
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        throwError('Coupon usage limit reached', 400)
    }

    const userUsed = await Order.countDocuments({
        user: userId,
        couponCode: coupon.code,
        orderStatus: { $ne: 'cancelled' },
    })
    if (userUsed >= coupon.perUserLimit) {
        throwError('You have already used this coupon', 400)
    }

    return { coupon, discount: calculateDiscount(coupon, amount) }
}

// Order
const redeemCoupon = async (coupon) => {
    const filter = { _id: coupon._id }
    if (coupon.usageLimit) filter.usedCount = { $lt: coupon.usageLimit }

    const updated = await Coupon.findOneAndUpdate(filter, { $inc: { usedCount: 1 } })
    if (!updated) throwError('Coupon usage limit reached', 400)
}

// Order cancel 
const releaseCoupon = async (code) => {
    if (!code) return
    await Coupon.updateOne({ code, usedCount: { $gt: 0 } }, { $inc: { usedCount: -1 } })
}

module.exports.checkCoupon = checkCoupon
module.exports.redeemCoupon = redeemCoupon
module.exports.releaseCoupon = releaseCoupon

module.exports.createCoupon = async (data) => {
    try {
        return await Coupon.create(data)
    } catch (err) {
        throw err
    }
}

module.exports.getAllCoupons = async () => {
    try {
        return await Coupon.find().sort({ createdAt: -1 })
    } catch (err) {
        throw err
    }
}

module.exports.getCouponById = async (id) => {
    try {
        return await Coupon.findById(id)
    } catch (err) {
        throw err
    }
}

module.exports.updateCoupon = async (id, data) => {
    try {
        return await Coupon.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    } catch (err) {
        throw err
    }
}

module.exports.toggleCouponStatus = async (id) => {
    try {
        const coupon = await Coupon.findById(id)
        if (!coupon) return null

        coupon.status = coupon.status === 'active' ? 'inactive' : 'active'
        await coupon.save()
        return coupon
    } catch (err) {
        throw err
    }
}

module.exports.deleteCoupon = async (id) => {
    try {
        return await Coupon.findByIdAndDelete(id)
    } catch (err) {
        throw err
    }
}

// User: checkout-la preview
module.exports.validateCoupon = async (userId, { code, orderAmount }) => {
    try {
        const { coupon, discount } = await checkCoupon(code, userId, orderAmount)
        return {
            code: coupon.code,
            description: coupon.description,
            discount,
            finalAmount: orderAmount - discount,
        }
    } catch (err) {
        throw err
    }
}