const mongoose = require('mongoose')

const cartSchema = new mongoos.Schema({
    userId : {
        type: String,
        required:true
    },
    products: [
        {
            productId:{
                type:String,
            },
            quantity:{
                type:Number,
                default:1,
            },
        },
        {timeStamps:true}
    ],
    amount:{type:Number,required:true}
})

module.exports = mongoose.model("CartSchema",cartSchema)