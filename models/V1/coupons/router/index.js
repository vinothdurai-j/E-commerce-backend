const express = require('express')
const controller = require('../controller/index')
const { authenticate, isAdmin, isUser } = require('../../../../middleware/auth')

const router = express.Router()

// User
router.post('/validateCoupon', authenticate, isUser, controller.validateCoupon)

// Admin
router.post('/createCoupon', authenticate, isAdmin, controller.createCoupon)
router.get('/getAllCoupons', authenticate, isAdmin, controller.getAllCoupons)
router.get('/getCouponById/:id', authenticate, isAdmin, controller.getCouponById)
router.put('/updateCoupon/:id', authenticate, isAdmin, controller.updateCoupon)
router.patch('/toggleCouponStatus/:id', authenticate, isAdmin, controller.toggleCouponStatus)
router.delete('/deleteCoupon/:id', authenticate, isAdmin, controller.deleteCoupon)

module.exports = router