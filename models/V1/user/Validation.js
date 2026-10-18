const Joi = require('joi')

const createValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().trim().required().messages({
            'string.empty': 'Name is required'
        }),

        email: Joi.string().email().trim().required().messages({
            'string.empty': 'Email is required',
            'string.email': 'Enter a valid email address'
        }),

        mobile: Joi.string().trim().allow(''),

        password: Joi.string().min(6).required().messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 6 characters'
        }),

        confirmPassword: Joi.any()
            .valid(Joi.ref('password'))
            .required()
            .messages({
                'any.required': 'Confirm password is required',
                'any.only': 'Passwords do not match'
            })
    })

    return schema.validate(data)
}


const updateValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().trim(),

        email: Joi.string().email().trim(),

        mobile: Joi.string().trim().allow(''),

        password: Joi.string().min(6).messages({
            'string.min': 'Password must be at least 6 characters'
        }),

        confirmPassword: Joi.any()
            .valid(Joi.ref('password'))
            .when('password', {
                is: Joi.exist(),
                then: Joi.required()
            })
            .messages({
                'any.required': 'Confirm password is required',
                'any.only': 'Passwords do not match'
            })
    })

    return schema.validate(data)
}




const registerValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().trim().required().messages({
            'string.empty': 'Username is required'
        }),
        email: Joi.string().email().trim().required().messages({
            'string.empty': 'Email is required',
            'string.email': 'Enter a valid email address'
        }),
        mobile: Joi.string().trim().length(10).pattern(/^[0-9]+$/).required().messages({
            'string.empty': 'Mobile number is required',
            'string.length': 'Mobile number must be 10 digits',
            'string.pattern.base': 'Mobile number must contain only digits'
        }),
        password: Joi.string().min(6).required().messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 6 characters'
        }),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
            'any.only': 'Passwords do not match',
            'string.empty': 'Confirm password is required'
        })
    })

    return schema.validate(data)
}

const loginValidation = (data) => {
    const schema = Joi.object({
        identifier: Joi.string().trim().required().messages({
            'string.empty': 'Email or Mobile is required'
        }),
        password: Joi.string().required().messages({
            'string.empty': 'Password is required'
        })
    })

    return schema.validate(data)
}



const forgotPasswordValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().trim().required().messages({
            'string.empty': 'Email is required',
            'string.email': 'Enter a valid email address'
        })
    })

    return schema.validate(data)
}

const resetPasswordValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().trim().required().messages({
            'string.empty': 'Email is required',
            'string.email': 'Enter a valid email address'
        }),
        otp: Joi.string().length(6).pattern(/^[0-9]+$/).required().messages({
            'string.empty': 'OTP is required',
            'string.length': 'OTP must be 6 digits',
            'string.pattern.base': 'OTP must contain only digits'
        }),
        password: Joi.string().min(6).required().messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 6 characters'
        }),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
            'any.only': 'Passwords do not match',
            'string.empty': 'Confirm password is required'
        })
    })

    return schema.validate(data)
}


module.exports = { loginValidation, registerValidation, updateValidation, createValidation, forgotPasswordValidation, resetPasswordValidation };
