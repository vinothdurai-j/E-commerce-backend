const service = require('../service/index')
const { createValidation, updateValidation } = require('../validations')


const handleError = (res, err) => {
    // duplicate name / slug
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0]
        return res.status(409).json({
            message: `Category ${field} already exists`
        })
    }
    // Wrong ObjectId
    if (err.name === 'CastError') {
        return res.status(400).json({ message: `Invalid ${err.path}` })
    }
    return res.status(err.statusCode || 500).json({
        message: err.message || 'Internal server error',
    })
}


module.exports.createCategory = async (req, res) => {
    try {
        const { error, value } = createValidation(req.body)
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            })
        }

        const category = await service.createCategory(value)

        return res.status(201).json({
            message: 'Category created successfully',
            data: category,
        })
    } catch (err) {
        return handleError(res, err)
    }
}

module.exports.getAllCategories = async (req, res) => {
    try {
        const onlyActive = !(req.user && req.user.role === 'admin')
        const categories = await service.getAllCategories(onlyActive)

        return res.status(200).json({
            message: 'Fetched all categories successfully',
            count: categories.length,
            data: categories,
        })
    } catch (err) {
        return handleError(res, err)
    }
}

module.exports.getCategoryById = async (req, res) => {
    try {
        const category = await service.getCategoryById(req.params.id)

        if (!category) {
            return res.status(404).json({ 
                 message: 'Category not found' })
        }

        return res.status(200).json({
            message: 'Fetched category successfully',
            data: category,
        })
    } catch (err) {
        return handleError(res, err)
    }
}

module.exports.updateCategory = async (req, res) => {
    try {
        const { error, value } = updateValidation(req.body)
        if (error) {
            return res.status(400).json({
                 message: error.details[0].message })
        }

        const category = await service.updateCategory(req.params.id, value)

        if (!category) {
            return res.status(404).json({
                 message: 'Category not found' })
        }

        return res.status(200).json({
            message: 'Category updated successfully',
            data: category,
        })
    } catch (err) {
        return handleError(res, err)
    }
}

module.exports.deleteCategory = async (req, res) => {
    try {
        const category = await service.deleteCategory(req.params.id)

        if (!category) {
            return res.status(404).json({ 
                message: 'Category not found' })
        }

        return res.status(200).json({
            message: 'Category deleted successfully',
            data: category,
        })
    } catch (err) {
        return handleError(res, err)
    }
}


module.exports.toggleCategoryStatus = async (req, res) => {
    try {
        const category = await service.toggleCategoryStatus(req.params.id)

        if (!category) {
            return res.status(404).json({
                  message: 'Category not found' })
        }

        return res.status(200).json({
            message: `Category status changed to ${category.status}`,
            data: category,
        })
    } catch (err) {
        return handleError(res, err)
    }
}