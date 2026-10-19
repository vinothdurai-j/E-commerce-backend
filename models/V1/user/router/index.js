const express = require('express');
const controller = require('../controller/index')
const { authenticate } = require('../../../../middleware/auth')

const router = express.Router()




// router.post('/create', controller.create)
// router.get('/getAll', controller.getAll)
router.get('/getuserById/:id', authenticate, controller.getuserById)
router.put('/update/:id', authenticate, controller.update)
router.delete('/delete/:id', authenticate, controller.delete)
router.post('/register', controller.register)
router.post('/login', controller.login)
router.post('/forgot-password',controller.forgotPassword)
router.post('/reset-password/',controller.resetPassword)

module.exports = router