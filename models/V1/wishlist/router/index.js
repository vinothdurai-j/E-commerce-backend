const express = require('express')
const controller = require('../controller/index')
const { authenticate, isUser } = require('../../../../middleware/auth')

const router = express.Router()

router.post('/addToWishlist', authenticate, isUser, controller.addToWishlist)
router.get('/getMyWishlist', authenticate, isUser, controller.getMyWishlist)
router.delete('/removeFromWishlist/:productId', authenticate, isUser, controller.removeFromWishlist)
router.delete('/clearWishlist', authenticate, isUser, controller.clearWishlist)

module.exports = router