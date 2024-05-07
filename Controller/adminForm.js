const productSchema=require('../Model/product')
const {tryCatch} = require('../Utils/tryCatch')
const joi = require('joi')

//joi validation
const schema =joi.object({
    name:joi.string().messages({
        'name.empty':"name is required"
    }),
    price:joi.number().messages({
        'price.base':"price must be number"
    }),
    description:joi.string().messages({
        'description.base':"Description must be string",
        'description.empty':"Description cannot empty"
    }),
    image:joi.string().messages({
        'image.base':'image url must be string '
    }),
    category:joi.string().messages({
        'category.base':"category musst be a string"
    })
    
})

//view all products

const viewProduct = tryCatch(async (req,res)=>{
    const product = await productSchema.find()
    if(product.length == 0){
        res.status(404).send("product is empty")
    }else{
        res.json(product)
    }
})


//view product by ID

const viewProductById= tryCatch(async(req,res)=>{
    const productId=req.params.id;
    const product = await productSchema.findById(productId)

    if(!product){
        res.status(404).json({
            success:false,
            message:"Product not found"
        })
    }else{
        res.status(200).json(product)
    }
})

//view product by category
const productByCategory = tryCatch(async(req,res)=>{
    const category= req.params.id;
    const productInCategory = await productSchema.aggregate([{$match:{category:category}}])
    if(productInCategory.length == 0){
        res.status(404).json({successa:false,
            message:"product not found in specified category"
        })
    }else{
        res.status(200).json(productInCategory)
    }
})
module.exports = {viewProduct,viewProductById,productByCategory}