const service = require('../service/index')
const { addToWishlistValidation } = require('../validations')

const handleError = (res, err) => {
    if (err.name === 'CastError') {
        return res.status(400).json({ message: `Invalid ${err.path}` })
    }
    return res.status(err.statusCode || 500).json({
        message: err.message || 'Internal server error',
    })
}

module.exports.addToWishlist = async (req, res) => {
    try {
        const { error, value } = addToWishlistValidation(req.body)
        if (error) {
            return res.status(400).json({ message: error.details[0].message })
        }

        const data = await service.addToWishlist(req.user.id, value.productId)
        return res.status(200).json({ message: 'Added to wishlist', data })
    } catch (err) {
        return handleError(res, err)
    }
}

module.exports.getMyWishlist = async (req, res) => {
    try {
        const data = await service.getMyWishlist(req.user.id)
        return res.status(200).json({ message: 'Fetched wishlist successfully', data })
    } catch (err) {
        return handleError(res, err)
    }
}

module.exports.removeFromWishlist = async (req, res) => {
    try {
        const data = await service.removeFromWishlist(req.user.id, req.params.productId)
        return res.status(200).json({ message: 'Removed from wishlist', data })
    } catch (err) {
        return handleError(res, err)
    }
}

module.exports.clearWishlist = async (req, res) => {
    try {
        const data = await service.clearWishlist(req.user.id)
        return res.status(200).json({ message: 'Wishlist cleared', data })
    } catch (err) {
        return handleError(res, err)
    }
}