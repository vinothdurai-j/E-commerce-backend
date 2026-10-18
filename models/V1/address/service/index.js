const Address = require('../model/index')

const MAX_ADDRESSES = 10

const throwError = (message, statusCode) => {
    const error = new Error(message)
    error.statusCode = statusCode
    throw error
}

module.exports.addAddress = async (userId, data) => {
    try {
        const count = await Address.countDocuments({ user: userId })
        if (count >= MAX_ADDRESSES) {
            throwError(`You can save maximum ${MAX_ADDRESSES} addresses`, 400)
        }

        // First address automatic default
        if (count === 0) data.isDefault = true

        if (data.isDefault) {
            await Address.updateMany({ user: userId }, { isDefault: false })
        }

        return await Address.create({ ...data, user: userId })
    } catch (err) {
        throw err
    }
}

module.exports.getMyAddresses = async (userId) => {
    try {
        return await Address.find({ user: userId }).sort({ isDefault: -1, createdAt: -1 })
    } catch (err) {
        throw err
    }
}

module.exports.getAddressById = async (userId, id) => {
    try {
        return await Address.findOne({ _id: id, user: userId })
    } catch (err) {
        throw err
    }
}

module.exports.updateAddress = async (userId, id, data) => {
    try {
        if (data.isDefault) {
            await Address.updateMany({ user: userId }, { isDefault: false })
        }

        return await Address.findOneAndUpdate(
            { _id: id, user: userId },
            data,
            { new: true, runValidators: true }
        )
    } catch (err) {
        throw err
    }
}

module.exports.deleteAddress = async (userId, id) => {
    try {
        const deleted = await Address.findOneAndDelete({ _id: id, user: userId })
        if (!deleted) return null

        if (deleted.isDefault) {
            const next = await Address.findOne({ user: userId }).sort({ createdAt: -1 })
            if (next) {
                next.isDefault = true
                await next.save()
            }
        }

        return deleted
    } catch (err) {
        throw err
    }
}

module.exports.setDefault = async (userId, id) => {
    try {
        const address = await Address.findOne({ _id: id, user: userId })
        if (!address) return null

        await Address.updateMany({ user: userId }, { isDefault: false })
        address.isDefault = true
        await address.save()
        return address
    } catch (err) {
        throw err
    }
}