const Wishlist = require('../model/index')
const { Model: Product } = require('../../products/model/index')

const MAX_ITEMS = 50

const throwError = (message, statusCode) => {
    const error = new Error(message)
    error.statusCode = statusCode
    throw error
}

const buildWishlistResponse = async (userId) => {
    const wishlist = await Wishlist.findOne({ user: userId }).populate(
        'products',
        'name price discountPrice images stock status averageRating reviewCount'
    )

    if (!wishlist) return { products: [], count: 0 }

    // Delete 
    const products = wishlist.products
        .filter((p) => p)
        .map((p) => ({
            ...p.toObject(),
            available: p.status === 'active' && p.stock > 0,
        }))

    return { products, count: products.length }
}

module.exports.addToWishlist = async (userId, productId) => {
    try {
        const product = await Product.findById(productId)
        if (!product) throwError('Product not found', 404)
        if (product.status !== 'active') throwError('Product is not available', 400)

        let wishlist = await Wishlist.findOne({ user: userId })
        if (!wishlist) wishlist = new Wishlist({ user: userId, products: [] })

        if (wishlist.products.some((p) => p.toString() === productId)) {
            throwError('Product already in wishlist', 409)
        }
        if (wishlist.products.length >= MAX_ITEMS) {
            throwError(`Wishlist can have maximum ${MAX_ITEMS} items`, 400)
        }

        wishlist.products.push(productId)
        await wishlist.save()
        return await buildWishlistResponse(userId)
    } catch (err) {
        throw err
    }
}

module.exports.getMyWishlist = async (userId) => {
    try {
        return await buildWishlistResponse(userId)
    } catch (err) {
        throw err
    }
}

module.exports.removeFromWishlist = async (userId, productId) => {
    try {
        const wishlist = await Wishlist.findOne({ user: userId })
        if (!wishlist) throwError('Wishlist is empty', 404)

        const before = wishlist.products.length
        wishlist.products = wishlist.products.filter((p) => p.toString() !== productId)
        if (wishlist.products.length === before) throwError('Product not in wishlist', 404)

        await wishlist.save()
        return await buildWishlistResponse(userId)
    } catch (err) {
        throw err
    }
}

module.exports.clearWishlist = async (userId) => {
    try {
        await Wishlist.findOneAndUpdate({ user: userId }, { products: [] })
        return { products: [], count: 0 }
    } catch (err) {
        throw err
    }
}