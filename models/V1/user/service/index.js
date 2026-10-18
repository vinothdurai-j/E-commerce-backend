const { Model } = require('../model/index')
const jwt = require('jsonwebtoken')
const sendEmail =require('../../../../utils/sendEmail')
const {welcomeEmail,otpEmail} =require('../../../../utils/emailTemplates')
const crypto = require('crypto')
module.exports.create = async (data) => {
    try {
        const newDoc = new Model(data)
        const savedData = await newDoc.save()
        return savedData
    } catch (err) {
        throw err
    }
}

module.exports.getAll = async () => {
    try {
        const data = await Model.find()
        return data
    } catch (err) {
        throw err
    }
}


module.exports.getuserById = async (id) => {

    try {
        const data = await Model.findById(id)
        return data
    } catch (err) {
        throw err
    }
}


module.exports.update = async (id, data) => {
    try {
        const updated = await Model.findByIdAndUpdate(id, data, { new: true })
        return updated
    } catch (err) {
        throw err
    }
}

module.exports.delete = async (id) => {
    try {
        const deleted = await Model.findByIdAndDelete(id)
        return deleted
    } catch (err) {
        throw err
    }
}


//Register User
module.exports.register = async (data) => {

    const { confirmPassword, ...userData } = data

    console.log("1. Register started")
    console.log("2. Email from request:", userData.email)

    const newDoc = new Model(userData)

    const savedData = await newDoc.save()

    console.log("3. User saved")
    console.log("4. Saved email:", savedData.email)
      console.log("5. Saved username:", savedData.username)

    try {

        console.log("5. Sending email...")

        await sendEmail({
            to: savedData.email,
            ...welcomeEmail(savedData.username)
        })

        console.log("6. Email sent successfully")

    } catch (err) {

        console.error("7. Email failed:", err)

    }

    const obj = savedData.toObject()

    delete obj.password

    return obj
}

//Login User

module.exports.login = async ({ identifier, password }) => {

    try {
        const user = await Model.findOne({
            $or: [
                {
                    email: identifier
                },
                {
                    mobile: identifier
                }
            ]
        })

        if (!user) {

            const error = new Error("User not found")
            error.statusCode = 404
            throw error
        }

        if (user.password !== password) {
            const error = new Error("Invalid password")
            error.statusCode = 401
            throw error
        }

        const token = jwt.sign({
              id: user._id,
            email: user.email,
            role: user.role
            
        },
            process.env.JWT_SECRET, {
            expiresIn: '1h'
        })

        return { token, user: { id: user._id, username: user.username, email: user.email,role:user.role } }
    } catch (err) {
        console.error(err)
        throw err
    }
}


const hashOtp = (otp) => crypto.createHash('sha256').update(otp).digest('hex')

module.exports.forgotPassword = async ({ email }) => {
    try {
        const user = await Model.findOne({ email: email.toLowerCase() })

      
        if (!user) return

        const otp = crypto.randomInt(100000, 1000000).toString()

        user.resetOtp = hashOtp(otp)
        user.resetOtpExpires = Date.now() + 10 * 60 * 1000
        user.resetOtpAttempts = 0
        await user.save()

        await sendEmail({
            to: user.email,
            ...otpEmail(user.username, otp)
        })
    } catch (err) {
        console.error("Forgot password error:", err)
        throw err
    }
}


module.exports.resetPassword = async ({ email, otp, password }) => {
    try {
        const user = await Model.findOne({ email: email.toLowerCase() })
            .select('+resetOtp +resetOtpExpires +resetOtpAttempts')

        // User illa / OTP illa / expire aayiduchu
        if (!user || !user.resetOtp || user.resetOtpExpires < Date.now()) {
            const error = new Error("Invalid or expired OTP")
            error.statusCode = 400
            throw error
        }

        // Too many wrong attempts
        if (user.resetOtpAttempts >= 5) {
            const error = new Error("Too many attempts. Please request a new OTP")
            error.statusCode = 429
            throw error
        }

        // Wrong OTP
        if (user.resetOtp !== hashOtp(otp)) {
            user.resetOtpAttempts += 1
            await user.save()

            const error = new Error("Invalid or expired OTP")
            error.statusCode = 400
            throw error
        }

        // OTP correct, password update
        user.password = password
        user.resetOtp = undefined
        user.resetOtpExpires = undefined
        user.resetOtpAttempts = 0
        await user.save()

    } catch (err) {
        console.error("Reset password error:", err)
        throw err
    }
}