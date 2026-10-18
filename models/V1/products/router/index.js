const express=require('express')
const controller=require('../controller/index')
const {authenticate,isAdmin,isUser} = require('../../../../middleware/auth')

const router=express.Router()

router.post('/createProduct',authenticate,isAdmin,controller.createProduct)
router.get('/getAllProducts',controller.getAllProducts)
router.get('/getProductById/:id',controller.getProductById)
router.put('/updateProduct/:id',authenticate,isAdmin,controller.updateProduct)
router.delete('/deleteProduct/:id',authenticate,isAdmin,controller.deleteProduct)
router.patch('/toggleProductStatus/:id',authenticate,isAdmin,controller.toggleProductStatus)
router.get('/filterProducts',controller.filterProducts)
module.exports=router