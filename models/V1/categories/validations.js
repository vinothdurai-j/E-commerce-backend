const Joi = require('joi')

const createValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().trim().required().messages({
            'string.empty': 'Name is required',
            'any.required': 'Name is required',
        }),
        description: Joi.string().trim().allow(''),
        image: Joi.string().trim().allow(''),
        parent: Joi.string().hex().length(24).allow(null),
        status: Joi.string().valid('active', 'inactive').messages({
            'any.only': 'Status must be active or inactive',
        }),
    })
    return schema.validate(data)
}

const updateValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().trim().messages({
            'string.empty': 'Name cannot be empty',
        }),
        description: Joi.string().trim().allow(''),
        image: Joi.string().trim().allow(''),
        parent: Joi.string().hex().length(24).allow(null),
        status: Joi.string().valid('active', 'inactive').messages({
            'any.only': 'Status must be active or inactive',
        }),
    })
        .min(1)
        .messages({ 'object.min': 'At least one field is required to update' })

    return schema.validate(data)
}

module.exports = { createValidation, updateValidation }