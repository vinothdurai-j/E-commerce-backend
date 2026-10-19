const adminService = require('../service/index')

const { loginValidation ,daysValidation,
    limitValidation,
    userListValidation,} = require('../validations')

    const handleError = (res, err) => {
    if (err.name === 'CastError') {
        return res.status(400).json({ message: `Invalid ${err.path}` })
    }
    return res.status(err.statusCode || 500).json({
        message: err.message || 'Internal server error',
    })
}

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





module.exports.getDashboardStats = async (req, res) => {
    try {
        const data = await adminService.getDashboardStats()
        return res.status(200).json({ message: 'Fetched dashboard stats', data })
    } catch (err) {
        return handleError(res, err)
    }
}

module.exports.getSalesChart = async (req, res) => {
    try {
        const { error, value } = daysValidation(req.query)
        if (error) return res.status(400).json({ message: error.details[0].message })

        const data = await adminService.getSalesChart(value.days)
        return res.status(200).json({ message: 'Fetched sales chart', data })
    } catch (err) {
        return handleError(res, err)
    }
}

module.exports.getTopProducts = async (req, res) => {
    try {
        const { error, value } = limitValidation(req.query)
        if (error) return res.status(400).json({ message: error.details[0].message })

        const data = await adminService.getTopProducts(value.limit)
        return res.status(200).json({ message: 'Fetched top products', data })
    } catch (err) {
        return handleError(res, err)
    }
}

module.exports.getLowStockProducts = async (req, res) => {
    try {
        const { error, value } = limitValidation(req.query)
        if (error) return res.status(400).json({ message: error.details[0].message })

        const data = await adminService.getLowStockProducts(value.limit)
        return res.status(200).json({ message: 'Fetched low stock products', count: data.length, data })
    } catch (err) {
        return handleError(res, err)
    }
}

module.exports.getAllUsers = async (req, res) => {
    try {
        const { error, value } = userListValidation(req.query)
        if (error) return res.status(400).json({ message: error.details[0].message })

        const data = await adminService.getAllUsers(value)
        return res.status(200).json({ message: 'Fetched users successfully', data })
    } catch (err) {
        return handleError(res, err)
    }
}

module.exports.getUserById = async (req, res) => {
    try {
        const data = await adminService.getUserById(req.params.id)
        if (!data) return res.status(404).json({ message: 'User not found' })

        return res.status(200).json({ message: 'Fetched user successfully', data })
    } catch (err) {
        return handleError(res, err)
    }
}

module.exports.toggleUserStatus = async (req, res) => {
    try {
        const user = await adminService.toggleUserStatus(req.params.id)
        if (!user) return res.status(404).json({ message: 'User not found' })

        return res.status(200).json({
            message: `User ${user.status === 'blocked' ? 'blocked' : 'unblocked'} successfully`,
            data: user,
        })
    } catch (err) {
        return handleError(res, err)
    }
}