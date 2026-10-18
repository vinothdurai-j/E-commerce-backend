const express = require('express')
const controller = require('../controller/index')

const {authenticate,isAdmin,isUser} = require('../../../../middleware/auth')


const router=express.Router()


router.post('/createCategory',authenticate,isAdmin,controller.createCategory)
router.get('/getAllCategories',controller.getAllCategories)
router.get('/getCategoryById/:id',controller.getCategoryById)
router.put('/updateCategory/:id',authenticate,isAdmin,controller.updateCategory)
router.delete('/deleteCategory/:id',authenticate,isAdmin,controller.deleteCategory)
router.patch('/toggleCategoryStatus/:id',authenticate,isAdmin,controller.toggleCategoryStatus)



module.exports=router
