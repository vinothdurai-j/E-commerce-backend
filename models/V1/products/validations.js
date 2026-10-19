const Joi = require('joi')

const createValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().trim().required().messages({
            'string.empty': 'Name is required',
            'any.required': 'Name is required'
        }),

        description: Joi.string().trim().required().messages({
            'string.empty': 'Description is required',
            'any.required': 'Description is required'
        }),

  category: Joi.string().hex().length(24).required().messages({
    'string.empty': 'Category is required',
    'any.required': 'Category is required',
    'string.length': 'Invalid category id',
    'string.hex': 'Invalid category id'
}),

        brand: Joi.string().trim().allow(''),

        price: Joi.number().min(0).required().messages({
            'number.base': 'Price must be a number',
            'number.min': 'Price cannot be negative',
            'any.required': 'Price is required'
        }),

        discountPrice: Joi.number().min(0).less(Joi.ref('price')).messages({
            'number.base': 'Discount price must be a number',
            'number.min': 'Discount price cannot be negative',
            'number.less': 'Discount price must be less than price'
        }),

        stock: Joi.number().integer().min(0).messages({
            'number.base': 'Stock must be a number',
            'number.integer': 'Stock must be a whole number',
            'number.min': 'Stock cannot be negative'
        }),

        sku: Joi.string().trim().required().messages({
            'string.empty': 'SKU is required',
            'any.required': 'SKU is required'
        }),

        images: Joi.array().items(Joi.string()),

        status: Joi.string().valid('active', 'inactive').messages({
            'any.only': 'Status must be active or inactive'
        })
    })

    return schema.validate(data)
}


const updateProductValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().trim().messages({
            'string.empty': 'Name cannot be empty'
        }),

        description: Joi.string().trim().messages({
            'string.empty': 'Description cannot be empty'
        }),

  category: Joi.string().hex().length(24).messages({
    'string.length': 'Invalid category id',
    'string.hex': 'Invalid category id'
}),

        brand: Joi.string().trim().allow(''),

        price: Joi.number().min(0).messages({
            'number.base': 'Price must be a number',
            'number.min': 'Price cannot be negative'
        }),

        discountPrice: Joi.number().min(0).less(Joi.ref('price')).messages({
            'number.base': 'Discount price must be a number',
            'number.min': 'Discount price cannot be negative',
            'number.less': 'Discount price must be less than price'
        }),

        stock: Joi.number().integer().min(0).messages({
            'number.base': 'Stock must be a number',
            'number.integer': 'Stock must be a whole number',
            'number.min': 'Stock cannot be negative'
        }),

        sku: Joi.string().trim().messages({
            'string.empty': 'SKU cannot be empty'
        }),

        images: Joi.array().items(Joi.string()),

        status: Joi.string().valid('active', 'inactive').messages({
            'any.only': 'Status must be active or inactive'
        })
    })
        .min(1)
        .messages({
            'object.min': 'At least one field is required to update'
        })

    return schema.validate(data)
}


const filterValidation = (data) => {
    const schema = Joi.object({
      category: Joi.string().hex().length(24).messages({
    'string.length': 'Invalid category id',
    'string.hex': 'Invalid category id'
}),
        brand: Joi.string().trim(),
        status: Joi.string().valid('active', 'inactive').messages({
            'any.only': 'Status must be active or inactive'
        }),
        minPrice: Joi.number().min(0).messages({
            'number.base': 'minPrice must be a number',
            'number.min': 'minPrice cannot be negative'
        }),
        maxPrice: Joi.number().min(0).messages({
            'number.base': 'maxPrice must be a number',
            'number.min': 'maxPrice cannot be negative'
        }),
        search: Joi.string().trim()
    })

    return schema.validate(data)
}
   



module.exports = { createValidation , updateProductValidation,filterValidation}  