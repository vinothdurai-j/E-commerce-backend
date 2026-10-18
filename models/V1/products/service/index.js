const  {Model} = require('../model/index')

module.exports.createProduct =async(data)=>{

    try{
        const newProduct = new Model(data)
const savedProduct = await newProduct.save()
return savedProduct
    } catch(err){
        throw err
    }
}

module.exports.getAllProducts = async()=>{

    try{
        const products =await Model.find()
        return products

    }catch(err){
        throw err
    }
}

module.exports.getProductById =async(id)=>{
    try{
        const product =await Model.findById(id)
        return product

    }catch(err){
        thr
    }
}


module.exports.updateProduct =async(id,data)=>{
    try{
        const updatedProduct =await Model.findByIdAndUpdate(id,data,{new:true})
        return updatedProduct
    }catch(err){
        throw  err
    }
}

module.exports.deleteProduct =async(id)=>{

    try{
        const deletedProduct =await Model.findByIdAndDelete(id)
        return deletedProduct
    }catch(err){
        throw err
    }
}

module.exports.toggleProductStatus = async(id)=>{

    try{
        const product =await Model.findById(id)

        if(!product){
            return null
        }

        product.status = product.status === 'active' ? 'inactive' : 'active'
        await product.save()
        return product

    }catch(err){
        throw err
    }
}

module.exports.filterProducts = async (filters) => {
    const query = {}

    if (filters.category) {
        const categoryExists = await Model.findOne({ category: filters.category })
        if (categoryExists) {
            query.category = filters.category
        }
    }

    if (filters.brand) {
        const brandExists = await Model.findOne({ brand: filters.brand })
        if (brandExists) {
            query.brand = filters.brand
        }
    }

    if (filters.status) {
        query.status = filters.status
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        query.price = {}
        if (filters.minPrice !== undefined) query.price.$gte = filters.minPrice
        if (filters.maxPrice !== undefined) query.price.$lte = filters.maxPrice
    }

    if (filters.search) {
        query.name = { $regex: filters.search, $options: 'i' }
    }

    const products = await Model.find(query)
    return products
}