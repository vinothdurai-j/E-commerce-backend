const Joi = require('joi')

const createValidation = (data) => {
    const schema = Joi.object({
        code: Joi.string().trim().alphanum().min(3).max(20).required().messages({
            'any.required': 'Coupon code is required',
            'string.alphanum': 'Code can have only letters and numbers',
        }),
        description: Joi.string().trim().allow(''),
        discountType: Joi.string().valid('percentage', 'flat').required().messages({
            'any.only': 'Discount type must be percentage or flat',
            'any.required': 'Discount type is required',
        }),
        discountValue: Joi.number().min(1).required().when('discountType', {
            is: 'percentage',
            then: Joi.number().max(100),
        }).messages({
            'any.required': 'Discount value is required',
            'number.max': 'Percentage cannot exceed 100',
        }),
        maxDiscount: Joi.number().min(0),
        minOrderAmount: Joi.number().min(0),
        startDate: Joi.date(),
        expiryDate: Joi.date().greater('now').required().messages({
            'any.required': 'Expiry date is required',
            'date.greater': 'Expiry date must be in the future',
        }),
        usageLimit: Joi.number().integer().min(1),
        perUserLimit: Joi.number().integer().min(1),
        status: Joi.string().valid('active', 'inactive'),
    })
    return schema.validate(data)
}

const updateValidation = (data) => {
    const schema = Joi.object({
        description: Joi.string().trim().allow(''),
        discountValue: Joi.number().min(1),
        maxDiscount: Joi.number().min(0),
        minOrderAmount: Joi.number().min(0),
        startDate: Joi.date(),
        expiryDate: Joi.date().greater('now'),
        usageLimit: Joi.number().integer().min(1),
        perUserLimit: Joi.number().integer().min(1),
        status: Joi.string().valid('active', 'inactive'),
    })
        .min(1)
        .messages({ 'object.min': 'At least one field is required to update' })
    return schema.validate(data)
}

const validateCouponValidation = (data) => {
    const schema = Joi.object({
        code: Joi.string().trim().required().messages({
            'any.required': 'Coupon code is required',
        }),
        orderAmount: Joi.number().min(0).required().messages({
            'any.required': 'Order amount is required',
        }),
    })
    return schema.validate(data)
}

module.exports = { createValidation, updateValidation, validateCouponValidation }