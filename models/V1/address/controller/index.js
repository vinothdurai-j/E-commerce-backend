const service = require('../service/index')
const { createValidation, updateValidation } = require('../validations')

const handleError = (res, err) => {
    if (err.name === 'CastError') {
        return res.status(400).json({
              message: `Invalid ${err.path}` })
    }
    return res.status(err.statusCode || 500).json({
        message: err.message || 'Internal server error',
    })
}

module.exports.addAddress = async (req, res) => {
    try {
        const { error, value } = createValidation(req.body)
        if (error) {
            return res.status(400).json({ 
                 message:error.details[0].message })
        }

        const address = await service.addAddress(req.user.id, value)

        return res.status(201).json({
            message: 'Address added successfully',
            data: address,
        })
    } catch (err) {
        return handleError(res, err)
    }
}

module.exports.getMyAddresses = async (req, res) => {
    try {
        const addresses = await service.getMyAddresses(req.user.id)
    console.log("add😑",addresses)
        return res.status(200).json({
            message: 'Fetched addresses successfully',
            count: addresses.length,
            data: addresses,
        })
    } catch (err) {
        return handleError(res, err)
    }
}

module.exports.getAddressById = async (req, res) => {
    try {
        const address = await service.getAddressById(req.user.id, req.params.id)
        
           

        if (!address) {
            
            return res.status(404).json({ 
            
                message: 'Address not found😑' })
                 
        }

        return res.status(200).json({
            message: 'Fetched address successfully',
            data: address,
        })
    } catch (err) {
        return handleError(res, err)
    }
}

module.exports.updateAddress = async (req, res) => {
    try {
        const { error, value } = updateValidation(req.body)
        if (error) {
            return res.status(400).json({ 
                message: error.details[0].message })
        }

        const address = await service.updateAddress(req.user.id, req.params.id, value)

        if (!address) {
            return res.status(404).json({
                  message: 'Address not found' })
        }

        return res.status(200).json({
            message: 'Address updated successfully',
            data: address,
        })
    } catch (err) {
        return handleError(res, err)
    }
}

module.exports.deleteAddress = async (req, res) => {
    try {
        const address = await service.deleteAddress(req.user.id, req.params.id)

        if (!address) {
            return res.status(404).json({ success: false, message: 'Address not found' })
        }

        return res.status(200).json({
            message: 'Address deleted successfully',
            data: address,
        })
    } catch (err) {
        return handleError(res, err)
    }
}

module.exports.setDefault = async (req, res) => {
    try {
        const address = await service.setDefault(req.user.id, req.params.id)

        if (!address) {
            return res.status(404).json({ success: false, message: 'Address not found' })
        }

        return res.status(200).json({
            message: 'Default address updated',
            data: address,
        })
    } catch (err) {
        return handleError(res, err)
    }
}