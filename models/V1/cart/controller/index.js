const service = require('../service/index')
const { addToCartValidation, updateQuantityValidation } = require('../validations')

const handleError = (res, err) => {
    if (err.name === 'CastError') {
        return res.status(400).json({
              message: `Invalid ${err.path}` })
    }
    return res.status(err.statusCode || 500).json({
        message: err.message || 'Internal server error',
    })
}

module.exports.addToCart = async (req, res) => {
    try {
        const { error, value } = addToCartValidation(req.body)
        if (error) {
            return res.status(400).json({ 
                message: error.details[0].message })
        }

        const cart = await service.addToCart(req.user.id, value)

        return res.status(200).json({
            message: 'Item added to cart',
            data: cart,
        })
    } catch (err) {
        return handleError(res, err)
    }
}

module.exports.getMyCart = async (req, res) => {
    try {
        const cart = await service.getMyCart(req.user.id)

        return res.status(200).json({
            message: 'Fetched cart successfully',
            data: cart,
        })
    } catch (err) {
        return handleError(res, err)
    }
}

module.exports.updateQuantity = async (req, res) => {
    try {
        const { error, value } = updateQuantityValidation(req.body)
        if (error) {
            return res.status(400).json({
                  message: error.details[0].message })
        }

        const cart = await service.updateQuantity(req.user.id, value)

        return res.status(200).json({
            message: 'Cart updated successfully',
            data: cart,
        })
    } catch (err) {
        return handleError(res, err)
    }
}

module.exports.removeItem = async (req, res) => {
    try {
        const cart = await service.removeItem(req.user.id, req.params.productId)

        return res.status(200).json({
            message: 'Item removed from cart',
            data: cart,
        })
    } catch (err) {
        return handleError(res, err)
    }
}

module.exports.clearCart = async (req, res) => {
    try {
        const cart = await service.clearCart(req.user.id)

        return res.status(200).json({
            message: 'Cart cleared successfully',
            data: cart,
        })
    } catch (err) {
        return handleError(res, err)
    }
}