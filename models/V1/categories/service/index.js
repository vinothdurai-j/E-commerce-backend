const Category = require('../model/index')

const { Model: Product } =require("../../products/model/index")

const makeSlug = (name) =>
    name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

const throwError = (message, statusCode) => {
    const error = new Error(message)
    error.statusCode = statusCode
    throw error
}

module.exports.createCategory = async (data) => {
    try {
        if (data.parent) {
            const parentExists = await Category.exists({
                 _id: data.parent 
                })
            if (!parentExists) 
                throwError('Parent category not found',
             404)
        }

        const category = await Category.create({ ...data, slug: makeSlug(data.name) })
        return category
    } catch (err) {
        throw err
    }
}


module.exports.getAllCategories = async (onlyActive = false) => {
    try {
        const query = onlyActive ? { status: 'active' } : {}
        return await Category.find(query).populate('parent', 'name slug').sort({ name: 1 })
    } catch (err) {
        throw err
    }
}


module.exports.getCategoryById = async (id) => {
    try {
        return await Category.findById(id).populate('parent', 'name slug')
    } catch (err) {
        throw err
    }
}


module.exports.updateCategory = async (id, data) => {
    try {
        if (data.parent && data.parent === id) {
            throwError('Category cannot be its own parent', 400)
        }

        if (data.parent) {
            const parentExists = await Category.exists({ _id: data.parent })
            if (!parentExists)
                 throwError('Parent category not found', 404)
        }

        if (data.name) {
            data.slug = makeSlug(data.name)
        }

        return await Category.findByIdAndUpdate(id, data, 
            { new: true, 
                runValidators: true })
    } catch (err) {
        throw err
    }
}


module.exports.deleteCategory = async (id) => {
    try {
        const productCount = await Product.countDocuments({ category: id })
        if (productCount > 0) {
            throwError('Category has products. Remove or move them first', 400)
        }

        const childCount = await Category.countDocuments({ parent: id })
        if (childCount > 0) {
            throwError('Category has sub-categories. Delete them first', 400)
        }

        return await Category.findByIdAndDelete(id)
    } catch (err) {
        throw err
    }

    
}


module.exports.toggleCategoryStatus = async (id) => {
    try {
        const category = await Category.findById(id)
        if (!category) return null

        category.status = category.status === 'active' ? 'inactive' : 'active'
        await category.save()
        return category
    } catch (err) {
        throw err
    }
}