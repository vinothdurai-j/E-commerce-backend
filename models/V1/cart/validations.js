const Joi = require('joi')

const objectId = Joi.string().hex().length(24)

const addToCartValidation = (data) => {
    const schema = Joi.object({
        productId: objectId.required().messages({
            'any.required': 'Product id is required',
            'string.length': 'Invalid product id',
        }),
        quantity: Joi.number().integer().min(1).max(10).default(1).messages({
            'number.base': 'Quantity must be a number',
            'number.min': 'Quantity must be at least 1',
            'number.max': 'Maximum 10 per item',
        }),
    })
    return schema.validate(data)
}

const updateQuantityValidation = (data) => {
    const schema = Joi.object({
        productId: objectId.required().messages({
            'any.required': 'Product id is required',
        }),
        quantity: Joi.number().integer().min(1).max(10).required().messages({
            'any.required': 'Quantity is required',
            'number.min': 'Quantity must be at least 1',
            'number.max': 'Maximum 10 per item',
        }),
    })
    return schema.validate(data)
}

module.exports = { addToCartValidation, updateQuantityValidation }