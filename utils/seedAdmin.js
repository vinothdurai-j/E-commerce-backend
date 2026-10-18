const adminService = require ('../models/V1/admin/service/index')

module.exports.seedAdmin=async()=>{
    try{
        await adminService.createDefalutAdmin();
    }catch(error){
        console.log('could not create default admin:',error.message)
    }
}