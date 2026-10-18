const adminService = require('../service/index')

const { loginValidation } = require('../validations')

module.exports.adminLogin = async (req,res)=>{

    try{
        const {error} =loginValidation(req.body)
if(error){
    return res.status(400).json({
        message:error.details[0].message
    })
}

const data = await adminService.adminLogin(req.body)

if(!data){

    return res.status(401).json({
        message: "Invalid Credentials"
    })
}

return res.status(200).json({
    message:"Login Successfull",
    data:data
})

    }
    catch(err){
         console.error(err)

        return res.status(err.status || 500).json({
            message: err.message || "Internal Server Error"
        })
    }
}