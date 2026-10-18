const express = require('express')
const controller = require('../controller/index')
const { authenticate, isUser } = require('../../../../middleware/auth')

const router = express.Router()

router.post('/addAddress', authenticate, isUser, controller.addAddress)
router.get('/getMyAddresses', authenticate, isUser, controller.getMyAddresses)
router.get('/getAddressById/:id', authenticate, isUser, controller.getAddressById)
router.put('/updateAddress/:id', authenticate, isUser, controller.updateAddress)
router.delete('/deleteAddress/:id', authenticate, isUser, controller.deleteAddress)
router.patch('/setDefault/:id', authenticate, isUser, controller.setDefault)

module.exports = router