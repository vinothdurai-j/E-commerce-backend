const Joi = require('joi')

const placeOrderValidation = (data) => {
    const schema = Joi.object({
        addressId: Joi.string().hex().length(24).required().messages({
            'any.required': 'Address is required',
            'string.length': 'Invalid address id',
        }),
        paymentMethod: Joi.string().valid('cod', 'online').default('cod').messages({
            'any.only': 'Payment method must be cod or online',
        }),
        couponCode: Joi.string().trim().allow(''),
    })
    return schema.validate(data)
}

const updateStatusValidation = (data) => {
    const schema = Joi.object({
        status: Joi.string()
            .valid('confirmed', 'shipped', 'delivered', 'cancelled')
            .required()
            .messages({
                'any.required': 'Status is required',
                'any.only': 'Status must be confirmed, shipped, delivered or cancelled',
            }),
    })
    return schema.validate(data)
}

const orderFilterValidation = (data) => {
    const schema = Joi.object({
        status: Joi.string().valid('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'),
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(50).default(10),
    })
    return schema.validate(data)
}

module.exports = { placeOrderValidation, updateStatusValidation, orderFilterValidation }