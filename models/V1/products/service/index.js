const { Model } = require('../model/index')
const Category = require('../../categories/model/index')

const throwError = (message, statusCode) => {
    const error = new Error(message)
    error.statusCode = statusCode
    throw error
}

const checkCategory = async (categoryId) => {
    const exists = await Category.exists({ _id: categoryId, status: 'active' })
    if (!exists) throwError('Category not found or inactive', 404)
}

module.exports.createProduct = async (data) => {
    try {
        await checkCategory(data.category)
        const newProduct = new Model(data)
        const savedProduct = await newProduct.save()
        return await savedProduct.populate('category', 'name slug')
    } catch (err) {
        throw err
    }
}

module.exports.getAllProducts = async () => {
    try {
        return await Model.find().populate('category', 'name slug')
    } catch (err) {
        throw err
    }
}

module.exports.getProductById = async (id) => {
    try {
        return await Model.findById(id).populate('category', 'name slug')
    } catch (err) {
        throw err
    }
}

module.exports.updateProduct = async (id, data) => {
    try {
        if (data.category) await checkCategory(data.category)
        return await Model.findByIdAndUpdate(id, data, { new: true, runValidators: true })
            .populate('category', 'name slug')
    } catch (err) {
        throw err
    }
}

module.exports.deleteProduct = async (id) => {
    try {
        return await Model.findByIdAndDelete(id)
    } catch (err) {
        throw err
    }
}

module.exports.toggleProductStatus = async (id) => {
    try {
        const product = await Model.findById(id)
        if (!product) return null

        product.status = product.status === 'active' ? 'inactive' : 'active'
        await product.save()
        return product
    } catch (err) {
        throw err
    }
}

module.exports.filterProducts = async (filters) => {
    try {
        const query = {}

        if (filters.category) query.category = filters.category
        if (filters.brand) query.brand = filters.brand
        if (filters.status) query.status = filters.status

        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
            query.price = {}
            if (filters.minPrice !== undefined) query.price.$gte = filters.minPrice
            if (filters.maxPrice !== undefined) query.price.$lte = filters.maxPrice
        }

        if (filters.search) {
            const safe = filters.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            query.name = { $regex: safe, $options: 'i' }
        }

        return await Model.find(query).populate('category', 'name slug')
    } catch (err) {
        throw err
    }
}