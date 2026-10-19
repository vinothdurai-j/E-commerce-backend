const express = require('express')
const controller = require('../controller/index')
const { authenticate, isAdmin } = require('../../../../middleware/auth')

const router = express.Router()

// Public
router.post('/adminlogin', controller.adminLogin)

// Admin only
router.get('/getDashboardStats', authenticate, isAdmin, controller.getDashboardStats)
router.get('/getSalesChart', authenticate, isAdmin, controller.getSalesChart)
router.get('/getTopProducts', authenticate, isAdmin, controller.getTopProducts)
router.get('/getLowStockProducts', authenticate, isAdmin, controller.getLowStockProducts)
router.get('/getAllUsers', authenticate, isAdmin, controller.getAllUsers)
router.get('/getUserById/:id', authenticate, isAdmin, controller.getUserById)
router.patch('/toggleUserStatus/:id', authenticate, isAdmin, controller.toggleUserStatus)

module.exports = router