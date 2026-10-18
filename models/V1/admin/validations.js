const Joi = require('joi')


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


module.exports={loginValidation}