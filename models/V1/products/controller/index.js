const service =require('../service/index')

const { createValidation,updateProductValidation,filterValidation} = require('../validations')

module.exports.createProduct = async (req, res) => {
    try {
        const { error, value } = createValidation(req.body)

        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            })
        }


        const product = await service.createProduct(value)

        return res.status(201).json({
            message:'Product created Successfully',
            data:product
        })
    }
    catch (err) {
    if (err.code === 11000) {
        return res.status(409).json({ message: 'SKU already exists' })
    }
    if (err.name === 'CastError') {
        return res.status(400).json({ message: `Invalid ${err.path}` })
    }
    return res.status(err.statusCode || 500).json({ message: err.message })
}



}


module.exports.getAllProducts = async(req,res)=>{

    try{
        const products =await service.getAllProducts()
        return res.status(200).json({
            message:"Fetched all products successfully",
            data:products
        })
    }catch (err) {
    if (err.code === 11000) {
        return res.status(409).json({ message: 'SKU already exists' })
    }
    if (err.name === 'CastError') {
        return res.status(400).json({ message: `Invalid ${err.path}` })
    }
    return res.status(err.statusCode || 500).json({ message: err.message })
}
}


module.exports.getProductById = async(req,res)=>{

    try{
        const id = req.params.id
        if(!id){
            return res.status(400).json({
                message:"Product id is required"
            })
        }
        const product =await service.getProductById(id)

        if(!product){
            return res.status(404).json({
                message:"Product not found"
            })
        }
        return res.status(200).json({
            message:"Fetched product successfully",
            data:product
        })
    }catch (err) {
    if (err.code === 11000) {
        return res.status(409).json({ message: 'SKU already exists' })
    }
    if (err.name === 'CastError') {
        return res.status(400).json({ message: `Invalid ${err.path}` })
    }
    return res.status(err.statusCode || 500).json({ message: err.message })
}
}

module.exports.updateProduct = async(req,res)=>{

    try{
        const id=req.params.id
        if(!id){
            return res.status(400).json({
                message:"Product id is required"
            })
        }
        const {error}=updateProductValidation(req.body)

        if(error){
            return res.status(400).json({
                message:error.details[0].message
            })
        }

        const product =await service.updateProduct(id,req.body)

        if(!product){
            return res.status(404).json({
                message:"Product not found"
            })
        }
        return res.status(200).json({
            message:"Product updated successfully",
            data:product
        })
    } 
    catch (err) {
    if (err.code === 11000) {
        return res.status(409).json({ message: 'SKU already exists' })
    }
    if (err.name === 'CastError') {
        return res.status(400).json({ message: `Invalid ${err.path}` })
    }
    return res.status(err.statusCode || 500).json({ message: err.message })
}
}


module.exports.deleteProduct = async(req,res)=>{

  try{
    const id=req.params.id
    if(!id){
        return res.status(400).json({
            message:"Product id is required"
        })

    }
    const deletedProduct =await service.deleteProduct(id)

    if(!deletedProduct){
        return res.status(404).json({
            message:"Product not found"
        })
    }
    return res.status(200).json({
        message:"Product deleted successfully",
        data:deletedProduct
    })
  }  
  catch (err) {
    if (err.code === 11000) {
        return res.status(409).json({ message: 'SKU already exists' })
    }
    if (err.name === 'CastError') {
        return res.status(400).json({ message: `Invalid ${err.path}` })
    }
    return res.status(err.statusCode || 500).json({ message: err.message })
}
}

module.exports.toggleProductStatus = async(req,res)=>{

    try{
        const id=req.params.id

        if(!id){
            return res.status(400).json({
                message:"Product id is required"
            })

            
        }
        const productStatus =await service.toggleProductStatus(id)

            if(!productStatus){
                return res.status(404).json({
                    message:"Product not found"
                })
            }
            return res.status(200).json({
                message:`Product status toggled to ${productStatus.status} successfully`,
                data:productStatus
            })
    }catch (err) {
    if (err.code === 11000) {
        return res.status(409).json({ message: 'SKU already exists' })
    }
    if (err.name === 'CastError') {
        return res.status(400).json({ message: `Invalid ${err.path}` })
    }
    return res.status(err.statusCode || 500).json({ message: err.message })
}
}

module.exports.filterProducts =async(req,res)=>{

    try{

        const {error,value}=filterValidation(req.query)

        if(error){
            return res.status(400).json({
                message:error.details[0].message
            })
        }
        const filteredProducts =await service.filterProducts(value)

if (filteredProducts.length === 0) {
    return res.status(404).json({
        message: "No products found for the given filters"
    })
}

        return res.status(200).json({
            message:"Filtered products fetched successfully",
              count: filteredProducts.length,
            data:filteredProducts
        })
    }catch (err) {
    if (err.code === 11000) {
        return res.status(409).json({ message: 'SKU already exists' })
    }
    if (err.name === 'CastError') {
        return res.status(400).json({ message: `Invalid ${err.path}` })
    }
    return res.status(err.statusCode || 500).json({ message: err.message })
}
}