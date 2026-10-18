const express = require('express')
const controller = require('../controller/index')

const router=express.Router()


router.post('/adminlogin',controller.adminLogin)




module.exports=router