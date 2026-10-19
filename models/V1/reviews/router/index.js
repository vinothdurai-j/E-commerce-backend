const express = require('express')
const controller = require('../controller/index')
const { authenticate, isAdmin, isUser } = require('../../../../middleware/auth')

const router = express.Router()

// Public
router.get('/getProductReviews/:productId', controller.getProductReviews)

// User
router.post('/addReview', authenticate, isUser, controller.addReview)
router.get('/getMyReviews', authenticate, isUser, controller.getMyReviews)
router.put('/updateReview/:id', authenticate, isUser, controller.updateReview)
router.delete('/deleteReview/:id', authenticate, isUser, controller.deleteReview)

// Admin
router.delete('/adminDeleteReview/:id', authenticate, isAdmin, controller.adminDeleteReview)

module.exports = router