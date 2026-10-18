const service = require('../service/index')
const {placeOrderValidation,updateStatusValidation,orderFilterValidation,} = require('../validations')

const handleError = (res, err) => {
    if (err.name === 'CastError') {
        return res.status(400).json({ 
             message: `Invalid ${err.path}` })
    }
    return res.status(err.statusCode || 500).json({
        message: err.message || 'Internal server error',
    })
}

module.exports.placeOrder = async (req, res) => {
    try {
        const { error, value } = placeOrderValidation(req.body)
        if (error) {
            return res.status(400).json({
                 message: error.details[0].message })
        }

        const order = await service.placeOrder(req.user.id, value)

        return res.status(201).json({
            message: 'Order placed successfully',
            data: order,
        })
    } catch (err) {
        return handleError(res, err)
    }
}

module.exports.getMyOrders = async (req, res) => {
    try {
        const orders = await service.getMyOrders(req.user.id)

        return res.status(200).json({
            message: 'Fetched orders successfully',
            count: orders.length,
            data: orders,
        })
    } catch (err) {
        return handleError(res, err)
    }
}

module.exports.getOrderById = async (req, res) => {
    try {
        const order = await service.getOrderById(req.user.id, req.params.id)

        if (!order) {
            return res.status(404).json({
                  message: 'Order not found' })
        }

        return res.status(200).json({
            message: 'Fetched order successfully',
            data: order,
        })
    } catch (err) {
        return handleError(res, err)
    }
}

module.exports.cancelOrder = async (req, res) => {
    try {
        const order = await service.cancelOrder(req.user.id, req.params.id)

        if (!order) {
            return res.status(404).json({
                 message: 'Order not found' })
        }

        return res.status(200).json({
            message: 'Order cancelled successfully',
            data: order,
        })
    } catch (err) {
        return handleError(res, err)
    }
}

module.exports.getAllOrders = async (req, res) => {
    try {
        const { error, value } = orderFilterValidation(req.query)
        if (error) {
            return res.status(400).json({ 
                 message: error.details[0].message })
        }

        const data = await service.getAllOrders(value)

        return res.status(200).json({
            message: 'Fetched all orders successfully',
            data,
        })
    } catch (err) {
        return handleError(res, err)
    }
}

module.exports.updateStatus = async (req, res) => {
    try {
        const { error, value } = updateStatusValidation(req.body)
        if (error) {
            return res.status(400).json({
                 message: error.details[0].message })
        }

        const order = await service.updateStatus(req.params.id, value.status)

        if (!order) {
            return res.status(404).json({
                  message: 'Order not found' })
        }

        return res.status(200).json({
            message: `Order status changed to ${order.orderStatus}`,
            data: order,
        })
    } catch (err) {
        return handleError(res, err)
    }
}