const Joi = require('joi')

const addToWishlistValidation = (data) => {
    const schema = Joi.object({
        productId: Joi.string().hex().length(24).required().messages({
            'any.required': 'Product id is required',
            'string.length': 'Invalid product id',
        }),
    })
    return schema.validate(data)
}

module.exports = { addToWishlistValidation }