const service = require('../service/index')
const {
    createValidation,
    updateValidation,
    validateCouponValidation,
} = require('../validations')

const handleError = (res, err) => {
    if (err.code === 11000) {
        return res.status(409).json({ message: 'Coupon code already exists' })
    }
    if (err.name === 'CastError') {
        return res.status(400).json({ message: `Invalid ${err.path}` })
    }
    return res.status(err.statusCode || 500).json({
        message: err.message || 'Internal server error',
    })
}

module.exports.createCoupon = async (req, res) => {
    try {
        const { error, value } = createValidation(req.body)
        if (error) return res.status(400).json({ message: error.details[0].message })

        const coupon = await service.createCoupon(value)
        return res.status(201).json({ message: 'Coupon created successfully', data: coupon })
    } catch (err) {
        return handleError(res, err)
    }
}

module.exports.getAllCoupons = async (req, res) => {
    try {
        const coupons = await service.getAllCoupons()
        return res.status(200).json({
            message: 'Fetched coupons successfully',
            count: coupons.length,
            data: coupons,
        })
    } catch (err) {
        return handleError(res, err)
    }
}

module.exports.getCouponById = async (req, res) => {
    try {
        const coupon = await service.getCouponById(req.params.id)
        if (!coupon) return res.status(404).json({ message: 'Coupon not found' })

        return res.status(200).json({ message: 'Fetched coupon successfully', data: coupon })
    } catch (err) {
        return handleError(res, err)
    }
}

module.exports.updateCoupon = async (req, res) => {
    try {
        const { error, value } = updateValidation(req.body)
        if (error) return res.status(400).json({ message: error.details[0].message })

        const coupon = await service.updateCoupon(req.params.id, value)
        if (!coupon) return res.status(404).json({ message: 'Coupon not found' })

        return res.status(200).json({ message: 'Coupon updated successfully', data: coupon })
    } catch (err) {
        return handleError(res, err)
    }
}

module.exports.toggleCouponStatus = async (req, res) => {
    try {
        const coupon = await service.toggleCouponStatus(req.params.id)
        if (!coupon) return res.status(404).json({ message: 'Coupon not found' })

        return res.status(200).json({
            message: `Coupon status changed to ${coupon.status}`,
            data: coupon,
        })
    } catch (err) {
        return handleError(res, err)
    }
}

module.exports.deleteCoupon = async (req, res) => {
    try {
        const coupon = await service.deleteCoupon(req.params.id)
        if (!coupon) return res.status(404).json({ message: 'Coupon not found' })

        return res.status(200).json({ message: 'Coupon deleted successfully', data: coupon })
    } catch (err) {
        return handleError(res, err)
    }
}

module.exports.validateCoupon = async (req, res) => {
    try {
        const { error, value } = validateCouponValidation(req.body)
        if (error) return res.status(400).json({ message: error.details[0].message })

        const data = await service.validateCoupon(req.user.id, value)
        return res.status(200).json({ message: 'Coupon applied', data })
    } catch (err) {
        return handleError(res, err)
    }
}