const Admin = require('../model/index')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const crypto = require('crypto')
module.exports.createDefaultAdmin = async () => {
    try {
        const { ADMIN_NAME, ADMIN_MOBILE, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env

        if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
            console.log('Admin seed skipped: ADMIN_EMAIL / ADMIN_PASSWORD missing in .env')
            return
        }

        const exists = await Admin.exists({})
        if (exists) return

        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10)

        await Admin.create({
            name: ADMIN_NAME || 'Admin',
            mobile: ADMIN_MOBILE,
            email: ADMIN_EMAIL.toLowerCase(),
            password: hashedPassword,
        })

        console.log('Default admin created:', ADMIN_EMAIL)
    } catch (error) {
        console.error('Admin seed failed:', error.message)
    }
}



module.exports.adminLogin = async ({ identifier, password }) => {

    try {
        const user = await Admin.findOne({
            $or: [
                {
                    email: identifier.toLowerCase()
                },
                {
                    mobile: identifier
                }
            ],

        }).select('+password')

        const isMatch = user && (await bcrypt.compare(password, user.password))

        if (!isMatch) {
            const error = new Error('Invalid credentials')
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

        return { token, user: { id: user._id, 
            username: user.name, 
            email: user.email
         } }
    } catch (err) {
        console.error(err)
        throw err
    }
}
