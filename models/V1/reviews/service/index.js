const mongoose = require('mongoose')
const Review = require('../model/index')
const Order = require('../../orders/model/index')
const { Model: Product } = require('../../products/model/index')

const throwError = (message, statusCode) => {
    const error = new Error(message)
    error.statusCode = statusCode
    throw error
}

const updateProductRating = async (productId) => {
    const stats = await Review.aggregate([
        { $match: { product: new mongoose.Types.ObjectId(productId) } },
        { $group: { _id: '$product', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ])

    const averageRating = stats.length ? Math.round(stats[0].avg * 10) / 10 : 0
    const reviewCount = stats.length ? stats[0].count : 0

    await Product.findByIdAndUpdate(productId, { averageRating, reviewCount })
}

module.exports.addReview = async (userId, { productId, rating, title, comment }) => {
    try {
        const product = await Product.findById(productId)
        if (!product) throwError('Product not found', 404)

        // Verified buyer: 
        const deliveredOrder = await Order.findOne({
            user: userId,
            orderStatus: 'delivered',
            'items.product': productId,
        })
        if (!deliveredOrder) {
            throwError('You can review only products you have purchased and received', 403)
        }

        const alreadyReviewed = await Review.exists({ user: userId, product: productId })
        if (alreadyReviewed) throwError('You have already reviewed this product', 409)

        const review = await Review.create({
            user: userId,
            product: productId,
            order: deliveredOrder._id,
            rating,
            title,
            comment,
        })

        await updateProductRating(productId)
        return review
    } catch (err) {
        throw err
    }
}

module.exports.getProductReviews = async (productId, { page, limit }) => {
    try {
        const [reviews, total, product] = await Promise.all([
            Review.find({ product: productId })
                .populate('user', 'username')
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            Review.countDocuments({ product: productId }),
            Product.findById(productId).select('name averageRating reviewCount'),
        ])

        if (!product) throwError('Product not found', 404)

        // Star-wise breakdown (5 star: 10, 4 star: 3 ...)
        const breakdownRaw = await Review.aggregate([
            { $match: { product: new mongoose.Types.ObjectId(productId) } },
            { $group: { _id: '$rating', count: { $sum: 1 } } },
        ])
        const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        breakdownRaw.forEach((b) => (breakdown[b._id] = b.count))

        return {
            averageRating: product.averageRating,
            reviewCount: product.reviewCount,
            breakdown,
            reviews,
            total,
            page,
            pages: Math.ceil(total / limit),
        }
    } catch (err) {
        throw err
    }
}

module.exports.getMyReviews = async (userId) => {
    try {
        return await Review.find({ user: userId })
            .populate('product', 'name images')
            .sort({ createdAt: -1 })
    } catch (err) {
        throw err
    }
}

module.exports.updateReview = async (userId, id, data) => {
    try {
        const review = await Review.findOneAndUpdate(
            { _id: id, user: userId },
            data,
            { new: true, runValidators: true }
        )
        if (!review) return null

        await updateProductRating(review.product)
        return review
    } catch (err) {
        throw err
    }
}

module.exports.deleteReview = async (userId, id) => {
    try {
        const review = await Review.findOneAndDelete({ _id: id, user: userId })
        if (!review) return null

        await updateProductRating(review.product)
        return review
    } catch (err) {
        throw err
    }
}

// Admin: 
module.exports.adminDeleteReview = async (id) => {
    try {
        const review = await Review.findByIdAndDelete(id)
        if (!review) return null

        await updateProductRating(review.product)
        return review
    } catch (err) {
        throw err
    }
}