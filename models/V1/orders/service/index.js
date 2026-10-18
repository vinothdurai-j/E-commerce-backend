const Order = require('../model/index')
const Cart = require('../../cart/model/index')
const Address = require('../../address/model/index')
const { Model: Product } = require('../../products/model/index')

const SHIPPING_FEE = 0 

const throwError = (message, statusCode) => {
    const error = new Error(message)
    error.statusCode = statusCode
    throw error
}

const generateOrderNumber = () =>
    `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`

const restoreStock = async (items) => {
    for (const item of items) {
        await Product.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } })
    }
}

const ALLOWED_TRANSITIONS = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['shipped', 'cancelled'],
    shipped: ['delivered'],
    delivered: [],
    cancelled: [],
}

module.exports.placeOrder = async (userId, { addressId, paymentMethod }) => {
    const reducedItems = [] 

    try {
        // 1. Address 
        const address = await Address.findOne({ _id: addressId, user: userId })
        if (!address) throwError('Address not found', 404)

        // 2. Cart
        const cart = await Cart.findOne({ user: userId }).populate('items.product')
        if (!cart || cart.items.length === 0) throwError('Cart is empty', 400)

        // 3. Validate + order items snapshot
        const orderItems = []
        for (const item of cart.items) {
            const product = item.product
            if (!product) throwError('A product in your cart no longer exists', 400)
            if (product.status !== 'active') throwError(`${product.name} is not available`, 400)
            if (product.stock < item.quantity) {
                throwError(`Only ${product.stock} left for ${product.name}`, 400)
            }

            const price = product.discountPrice || product.price
            orderItems.push({
                product: product._id,
                name: product.name,
                image: product.images && product.images[0],
                price,
                quantity: item.quantity,
                subtotal: price * item.quantity,
            })
        }

        // 4. Stock 
        for (const item of orderItems) {
            const updated = await Product.findOneAndUpdate(
                { _id: item.product, status: 'active', stock: { $gte: item.quantity } },
                { $inc: { stock: -item.quantity } }
            )
            if (!updated) {
                await restoreStock(reducedItems) // munnaadi kuraichadhu thirumba
                throwError(`${item.name} is out of stock`, 400)
            }
            reducedItems.push(item)
        }

        // 5. Order create
        const itemsTotal = orderItems.reduce((sum, i) => sum + i.subtotal, 0)

        let order
        try {
            order = await Order.create({
                orderNumber: generateOrderNumber(),
                user: userId,
                items: orderItems,
                shippingAddress: {
                    fullName: address.fullName,
                    mobile: address.mobile,
                    addressLine1: address.addressLine1,
                    addressLine2: address.addressLine2,
                    landmark: address.landmark,
                    city: address.city,
                    state: address.state,
                    pincode: address.pincode,
                    country: address.country,
                },
                itemsTotal,
                shippingFee: SHIPPING_FEE,
                totalAmount: itemsTotal + SHIPPING_FEE,
                paymentMethod,
            })
        } catch (createErr) {
            await restoreStock(reducedItems) // order fail aana stock thirumba
            throw createErr
        }

        // 6. Cart clear
        cart.items = []
        await cart.save()

        return order
    } catch (err) {
        throw err
    }
}

module.exports.getMyOrders = async (userId) => {
    try {
        return await Order.find({ user: userId }).sort({ createdAt: -1 })
    } catch (err) {
        throw err
    }
}

module.exports.getOrderById = async (userId, id) => {
    try {
        return await Order.findOne({ _id: id, user: userId })
    } catch (err) {
        throw err
    }
}

module.exports.cancelOrder = async (userId, id) => {
    try {
        const order = await Order.findOne({ _id: id, user: userId })
        if (!order) return null

        if (!['pending', 'confirmed'].includes(order.orderStatus)) {
            throwError(`Order cannot be cancelled once it is ${order.orderStatus}`, 400)
        }

        order.orderStatus = 'cancelled'
        order.cancelledAt = new Date()
        if (order.paymentStatus === 'paid') order.paymentStatus = 'refunded'
        await order.save()

        await restoreStock(order.items)
        return order
    } catch (err) {
        throw err
    }
}

// ---------- Admin ----------

module.exports.getAllOrders = async ({ status, page, limit }) => {
    try {
        const query = status ? { orderStatus: status } : {}

        const [orders, total] = await Promise.all([
            Order.find(query)
                .populate('user', 'username email mobile')
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            Order.countDocuments(query),
        ])

        return { orders, total, page, pages: Math.ceil(total / limit) }
    } catch (err) {
        throw err
    }
}

module.exports.updateStatus = async (id, status) => {
    try {
        const order = await Order.findById(id)
        if (!order) return null

        const allowed = ALLOWED_TRANSITIONS[order.orderStatus]
        if (!allowed.includes(status)) {
            throwError(`Cannot change status from ${order.orderStatus} to ${status}`, 400)
        }

        order.orderStatus = status

        if (status === 'delivered') {
            order.deliveredAt = new Date()
            if (order.paymentMethod === 'cod') order.paymentStatus = 'paid' // COD: deliver aana aprom paid
        }

        if (status === 'cancelled') {
            order.cancelledAt = new Date()
            if (order.paymentStatus === 'paid') order.paymentStatus = 'refunded'
            await restoreStock(order.items)
        }

        await order.save()
        return order
    } catch (err) {
        throw err
    }
}