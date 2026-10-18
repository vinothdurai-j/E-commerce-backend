const express = require('express')
const controller = require('../controller/index')
const { authenticate, isUser } = require('../../../../middleware/auth')

const router = express.Router()

router.post('/addToCart', authenticate, isUser, controller.addToCart)
router.get('/getMyCart', authenticate, isUser, controller.getMyCart)
router.put('/updateQuantity', authenticate, isUser, controller.updateQuantity)
router.delete('/removeItem/:productId', authenticate, isUser, controller.removeItem)
router.delete('/clearCart', authenticate, isUser, controller.clearCart)

module.exports = router