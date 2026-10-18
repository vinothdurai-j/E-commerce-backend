const express=require('express')
const controller=require('../controller/index')
const router=express.Router()

router.post('/createProduct',controller.createProduct)
router.get('/getAllProducts',controller.getAllProducts)
router.get('/getProductById/:id',controller.getProductById)
router.put('/updateProduct/:id',controller.updateProduct)
router.delete('/deleteProduct/:id',controller.deleteProduct)
router.patch('/toggleProductStatus/:id',controller.toggleProductStatus)
router.get('/filterProducts',controller.filterProducts)
module.exports=router