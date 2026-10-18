const jwt = require('jsonwebtoken')

module.exports.authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access token is required"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()

    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Token expired"
            })
        }

        if (err.name === 'JsonWebTokenError') {
            return res.status(403).json({
                success: false,
                message: "Invalid token"
            })
        }

        return res.status(500).json({
            success: false,
            message: "Authentication failed"
        })
    }
}