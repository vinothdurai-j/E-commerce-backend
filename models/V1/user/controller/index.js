const service = require('../service/index')
const { createValidation, updateValidation, registerValidation, loginValidation,forgotPasswordValidation ,resetPasswordValidation} = require('../Validation')

module.exports.create = async (req, res) => {
    try {
        const { error } = createValidation(req.body)


        if (error) {
            return res.status(400).json({
                message: error.details[0].message

            }
            )
        }

        const data = await service.create(req.body)

        return res.status(201).json({
            message: "Created successfully",
            data
        })

    } catch (err) {
        console.error(err)

        if (err.code === 11000) {
            const field = Object.keys(err.keyPattern)[0]
            return res.status(409).json({
                message: `${field} already exists`
            })
        }

        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

module.exports.getAll = async (req, res) => {
    try {
        const data = await service.getAll()

        return res.status(200).json({
            message: "Fetched successfully",
            data: data
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}


module.exports.getuserById = async (req, res) => {
    try {

        const id = req.params.id

        // ID missing
        if (!id) {
            return res.status(400).json({
                message: "User ID is required"
            })
        }

        if (req.user.id !== id) {
            return res.status(403).json({
                message: "User token is required🚪 "
            })
        }
        const data = await service.getuserById(id)

        // User not found
        if (!data) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        return res.status(200).json({
            message: "Fetched successfully",
            data: data
        })

    } catch (err) {

        return res.status(500).json({
            message: err.message
        })
    }
}

module.exports.update = async (req, res) => {
    try {

        const id = req.params.id

        if (!id) {
            return res.status(400).json({
                message: "ID is required"
            })
        }

        if (req.user.id !== id) {
            return res.status(403).json({
                message: "user token is required"
            })
        }

        const { error } = updateValidation(req.body)

        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            })
        }

        const data = await service.update(id, req.body)

        if (!data) {
            return res.status(404).json({
                message: "Record not found"
            })
        }

        return res.status(200).json({
            message: "Updated successfully",
            data: data
        })

    } catch (err) {

        return res.status(500).json({
            message: err.message
        })
    }
}

module.exports.delete = async (req, res) => {
    try {

        const id = req.params.id
        console.log("🤷‍♂️", id)
        if (!id) {
            return res.status(400).json({
                message: "ID is required"
            })
        }

        if (req.user.id !== id) {
            return res.status(403).json({
                message: "User token is required"
            })
        }
        console.log("Token User ID:", req.user.id)
        console.log("URL User ID:", id)
        const data = await service.delete(id)

        if (!data) {
            return res.status(404).json({
                message: "Record not found"
            })
        }

        return res.status(200).json({
            message: "Deleted successfully",
            data: data
        })

    } catch (err) {

        return res.status(500).json({
            message: err.message
        })
    }
}


// Register User
module.exports.register = async (req, res) => {
    try {
        const { error } = registerValidation(req.body)
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            })
        }

        const data = await service.register(req.body)

        return res.status(201).json({
            message: "user Registered Successfully",
            data: data
        })
    }
    catch (err) {

      

        if (err.code === 11000) {
            const filed = Object.keys(err.keyPattern)[0]
            return res.status(409).json({
                message: `${filed} already exists`

            })
        }

        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

//Login User
module.exports.login = async (req, res) => {

    try {
        const { error } = loginValidation(req.body)

        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            })
        }

        const data = await service.login(req.body)

        if (!data) {
            return res.status(401).json({
                message: "Invalid credentials"
            })
        }
        return res.status(200).json({
            message: "Login Successful",
            data: data,

        })

    }
    catch (err) {
        console.error(err)

        return res.status(err.status || 500).json({
            message: err.message || "Internal Server Error"
        })
    }
}


module.exports.forgotPassword = async (req, res) => {
    try {
        const { error } = forgotPasswordValidation(req.body)

        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            })
        }

        await service.forgotPassword(req.body)

        return res.status(200).json({
            message: "If that email exists, an OTP has been sent."
        })

    } catch (err) {
        console.error(err)

        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}


module.exports.resetPassword = async (req, res) => {
    try {
        const { error } = resetPasswordValidation(req.body)

        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            })
        }

        await service.resetPassword(req.body)

        return res.status(200).json({
            message: "Password reset successfully"
        })

    } catch (err) {
        console.error(err)

        return res.status(err.statusCode || 500).json({
            message: err.message || "Internal Server Error"
        })
    }
}