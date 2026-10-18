const Joi = require('joi')

const addressFields = {
    fullName: Joi.string().trim(),
    mobile: Joi.string().pattern(/^[6-9]\d{9}$/).messages({
        'string.pattern.base': 'Enter a valid 10 digit mobile number',
    }),
    addressLine1: Joi.string().trim(),
    addressLine2: Joi.string().trim().allow(''),
    landmark: Joi.string().trim().allow(''),
    city: Joi.string().trim(),
    state: Joi.string().trim(),
    pincode: Joi.string().pattern(/^\d{6}$/).messages({
        'string.pattern.base': 'Pincode must be 6 digits',
    }),
    country: Joi.string().trim(),
    type: Joi.string().valid('home', 'work', 'other').messages({
        'any.only': 'Type must be home, work or other',
    }),
    isDefault: Joi.boolean(),
}

const createValidation = (data) => {
    const schema = Joi.object({
        ...addressFields,
        fullName: addressFields.fullName.required().messages({ 'any.required': 'Full name is required' }),
        mobile: addressFields.mobile.required().messages({ 'any.required': 'Mobile is required' }),
        addressLine1: addressFields.addressLine1.required().messages({ 'any.required': 'Address line 1 is required' }),
        city: addressFields.city.required().messages({ 'any.required': 'City is required' }),
        state: addressFields.state.required().messages({ 'any.required': 'State is required' }),
        pincode: addressFields.pincode.required().messages({ 'any.required': 'Pincode is required' }),
    })
    return schema.validate(data)
}

const updateValidation = (data) => {
    const schema = Joi.object(addressFields)
        .min(1)
        .messages({ 'object.min': 'At least one field is required to update' })
    return schema.validate(data)
}

module.exports = { createValidation, updateValidation }