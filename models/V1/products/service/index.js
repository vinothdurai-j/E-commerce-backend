const { Model } = require('../model/index')
const Category = require('../../categories/model/index')
const { createUploadUrl, verifyUploaded, deleteFileByUrl } = require('../../../../utils/s3Upload')
const throwError = (message, statusCode) => {
    const error = new Error(message)
    error.statusCode = statusCode
    throw error
}
const MAX_IMAGES = 5

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
        const deleted = await Model.findByIdAndDelete(id)
        if (deleted) {
            await Promise.all(
                deleted.images.map((u) =>
                    deleteFileByUrl(u).catch((e) => console.error('S3 delete failed:', e.message))
                )
            )
        }
        return deleted
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



module.exports.getUploadUrls = async (id, files) => {
    try {
        const product = await Model.findById(id)
        if (!product) return null

        if (product.images.length + files.length > MAX_IMAGES) {
            throwError(`A product can have maximum ${MAX_IMAGES} images`, 400)
        }

        return await Promise.all(files.map((f) => createUploadUrl(f.contentType, 'products')))
    } catch (err) {
        throw err
    }
}

module.exports.confirmImages = async (id, imageUrls) => {
    try {
        const product = await Model.findById(id)
        if (!product) return null

        if (product.images.length + imageUrls.length > MAX_IMAGES) {
            throwError(`A product can have maximum ${MAX_IMAGES} images`, 400)
        }

        for (const url of imageUrls) {
            if (product.images.includes(url)) throwError('Image already added', 409)
            const ok = await verifyUploaded(url, 'products')
            if (!ok) throwError('Image not found in storage or too large', 400)
        }

        product.images.push(...imageUrls)
        await product.save()
        return await product.populate('category', 'name slug')
    } catch (err) {
        throw err
    }
}

module.exports.deleteImage = async (id, imageUrl) => {
    try {
        const product = await Model.findById(id)
        if (!product) return null

        if (!product.images.includes(imageUrl)) throwError('Image not found in this product', 404)

        product.images = product.images.filter((u) => u !== imageUrl)
        await product.save()

        await deleteFileByUrl(imageUrl).catch((e) => console.error('S3 delete failed:', e.message))
        return product
    } catch (err) {
        throw err
    }
}