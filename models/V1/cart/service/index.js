const Cart = require('../model/index')
const { Model: Product } = require('../../products/model/index') 

const MAX_PER_ITEM = 10

const throwError = (message, statusCode) => {
    const error = new Error(message)
    error.statusCode = statusCode
    throw error
}

const buildCartResponse = async (userId) => {
    const cart = await Cart.findOne({ user: userId }).populate(
        'items.product',
        'name price discountPrice stock images status'
    )

    if (!cart) return { items: [], totalItems: 0, totalAmount: 0 }

    const validItems = cart.items.filter((i) => i.product)

    const items = validItems.map((i) => {
        const price = i.product.discountPrice || i.product.price
        return {
            product: i.product,
            quantity: i.quantity,
            price,
            subtotal: price * i.quantity,
            available: i.product.status === 'active' && i.product.stock >= i.quantity,
        }
    })

    return {
        items,
        totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
        totalAmount: items.reduce((sum, i) => sum + i.subtotal, 0),
    }
}

module.exports.addToCart = async (userId, { productId, quantity }) => {
    try {
        const product = await Product.findById(productId)
        if (!product) throwError('Product not found', 404)
        if (product.status !== 'active') 
            throwError('Product is not available', 400)

        let cart = await Cart.findOne({ user: userId })
        if (!cart) cart = new Cart({ user: userId, items: [] })

        const existing = cart.items.find((i) => i.product.toString() === productId)
        const newQty = (existing ? existing.quantity : 0) + quantity

        if (newQty > MAX_PER_ITEM) throwError(`Maximum ${MAX_PER_ITEM} per item`, 400)
        if (newQty > product.stock) throwError(`Only ${product.stock} items in stock`, 400)

        if (existing) {
            existing.quantity = newQty
        } else {
            cart.items.push({ product: productId, quantity })
        }

        await cart.save()
        return await buildCartResponse(userId)
    } catch (err) {
        throw err
    }
}

module.exports.getMyCart = async (userId) => {
    try {
        return await buildCartResponse(userId)
    } catch (err) {
        throw err
    }
}

module.exports.updateQuantity = async (userId, { productId, quantity }) => {
    try {
        const cart = await Cart.findOne({ user: userId })
        if (!cart) throwError('Cart is empty', 404)

        const item = cart.items.find((i) => i.product.toString() === productId)
        if (!item) throwError('Item not found in cart', 404)

        const product = await Product.findById(productId)
        if (!product) throwError('Product not found', 404)
        if (quantity > product.stock) throwError(`Only ${product.stock} items in stock`, 400)

        item.quantity = quantity
        await cart.save()
        return await buildCartResponse(userId)
    } catch (err) {
        throw err
    }
}

module.exports.removeItem = async (userId, productId) => {
    try {
        const cart = await Cart.findOne({ user: userId })
        if (!cart) throwError('Cart is empty', 404)

        const before = cart.items.length
        cart.items = cart.items.filter((i) => i.product.toString() !== productId)

        if (cart.items.length === before) 
            throwError('Item not found in cart', 404)

        await cart.save()
        return await buildCartResponse(userId)
    } catch (err) {
        throw err
    }
}

module.exports.clearCart = async (userId) => {
    try {
        await Cart.findOneAndUpdate({ user: userId }, { items: [] })
        return { items: [], totalItems: 0, totalAmount: 0 }
    } catch (err) {
        throw err
    }
}