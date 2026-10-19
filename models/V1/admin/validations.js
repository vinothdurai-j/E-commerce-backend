const Joi = require('joi')

const loginValidation = (data) => {
    const schema = Joi.object({
        identifier: Joi.string().trim().required().messages({
            'string.empty': 'Email or Mobile is required',
            'any.required': 'Email or Mobile is required',
        }),
        password: Joi.string().required().messages({
            'string.empty': 'Password is required',
            'any.required': 'Password is required',
        }),
    })
    return schema.validate(data)
}

const daysValidation = (data) => {
    const schema = Joi.object({
        days: Joi.number().integer().valid(7, 14, 30, 90).default(7).messages({
            'any.only': 'Days must be 7, 14, 30 or 90',
        }),
    })
    return schema.validate(data)
}

const limitValidation = (data) => {
    const schema = Joi.object({
        limit: Joi.number().integer().min(1).max(50).default(5),
    })
    return schema.validate(data)
}

const userListValidation = (data) => {
    const schema = Joi.object({
        search: Joi.string().trim().allow(''),
        status: Joi.string().valid('active', 'blocked'),
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(50).default(10),
    })
    return schema.validate(data)
}

module.exports = { loginValidation, daysValidation, limitValidation, userListValidation }