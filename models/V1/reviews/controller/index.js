const service = require('../service/index')
const {
    addReviewValidation,
    updateReviewValidation,
    listValidation,
} = require('../validations')

const handleError = (res, err) => {
    if (err.code === 11000) {
        return res.status(409).json({
             message: 'You have already reviewed this product' })
    }
    if (err.name === 'CastError') {
        return res.status(400).json({ message: `Invalid ${err.path}` })
    }
    return res.status(err.statusCode || 500).json({
        message: err.message || 'Internal server error',
    })
}

module.exports.addReview = async (req, res) => {
    try {
        const { error, value } = addReviewValidation(req.body)
        if (error) {
            return res.status(400).json({ message: error.details[0].message })
        }

        const review = await service.addReview(req.user.id, value)

        return res.status(201).json({
            message: 'Review added successfully',
            data: review,
        })
    } catch (err) {
        return handleError(res, err)
    }
}

module.exports.getProductReviews = async (req, res) => {
    try {
        const { error, value } = listValidation(req.query)
        if (error) {
            return res.status(400).json({ message: error.details[0].message })
        }

        const data = await service.getProductReviews(req.params.productId, value)

        return res.status(200).json({
            message: 'Fetched reviews successfully',
            data,
        })
    } catch (err) {
        return handleError(res, err)
    }
}

module.exports.getMyReviews = async (req, res) => {
    try {
        const reviews = await service.getMyReviews(req.user.id)

        return res.status(200).json({
            message: 'Fetched your reviews successfully',
            count: reviews.length,
            data: reviews,
        })
    } catch (err) {
        return handleError(res, err)
    }
}

module.exports.updateReview = async (req, res) => {
    try {
        const { error, value } = updateReviewValidation(req.body)
        if (error) {
            return res.status(400).json({ message: error.details[0].message })
        }

        const review = await service.updateReview(req.user.id, req.params.id, value)

        if (!review) {
            return res.status(404).json({ message: 'Review not found' })
        }

        return res.status(200).json({
            message: 'Review updated successfully',
            data: review,
        })
    } catch (err) {
        return handleError(res, err)
    }
}

module.exports.deleteReview = async (req, res) => {
    try {
        const review = await service.deleteReview(req.user.id, req.params.id)

        if (!review) {
            return res.status(404).json({ message: 'Review not found' })
        }

        return res.status(200).json({
            message: 'Review deleted successfully',
            data: review,
        })
    } catch (err) {
        return handleError(res, err)
    }
}

module.exports.adminDeleteReview = async (req, res) => {
    try {
        const review = await service.adminDeleteReview(req.params.id)

        if (!review) {
            return res.status(404).json({ message: 'Review not found' })
        }

        return res.status(200).json({
            message: 'Review removed by admin',
            data: review,
        })
    } catch (err) {
        return handleError(res, err)
    }
}