const express = require('express')
const controller = require('../controller/index')
const { authenticate, isAdmin, isUser } = require('../../../../middleware/auth')

const router = express.Router()

// User
router.post('/placeOrder', authenticate, isUser, controller.placeOrder)
router.get('/getMyOrders', authenticate, isUser, controller.getMyOrders)
router.get('/getOrderById/:id', authenticate, isUser, controller.getOrderById)
router.patch('/cancelOrder/:id', authenticate, isUser, controller.cancelOrder)

// Admin
router.get('/getAllOrders', authenticate, isAdmin, controller.getAllOrders)
router.patch('/updateStatus/:id', authenticate, isAdmin, controller.updateStatus)

module.exports = router