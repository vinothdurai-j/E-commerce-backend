const Joi = require('joi')

const objectId = Joi.string().hex().length(24)

const addReviewValidation = (data) => {
    const schema = Joi.object({
        productId: objectId.required().messages({
            'any.required': 'Product id is required',
            'string.length': 'Invalid product id',
        }),
        rating: Joi.number().integer().min(1).max(5).required().messages({
            'any.required': 'Rating is required',
            'number.min': 'Rating must be between 1 and 5',
            'number.max': 'Rating must be between 1 and 5',
        }),
        title: Joi.string().trim().max(100).allow(''),
        comment: Joi.string().trim().max(1000).allow(''),
    })
    return schema.validate(data)
}

const updateReviewValidation = (data) => {
    const schema = Joi.object({
        rating: Joi.number().integer().min(1).max(5).messages({
            'number.min': 'Rating must be between 1 and 5',
            'number.max': 'Rating must be between 1 and 5',
        }),
        title: Joi.string().trim().max(100).allow(''),
        comment: Joi.string().trim().max(1000).allow(''),
    })
        .min(1)
        .messages({ 'object.min': 'At least one field is required to update' })
    return schema.validate(data)
}

const listValidation = (data) => {
    const schema = Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(50).default(10),
    })
    return schema.validate(data)
}

module.exports = { addReviewValidation, updateReviewValidation, listValidation }