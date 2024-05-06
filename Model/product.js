const mongoose=require('mongoose')

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        unique:true
    },
    price: {
        type: Number,
    },
    description:{
        type: String,
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum:{
            values:["men","woman"]
        }
    },
    createdAt: String,
    updatedAt: String,

},
{
    timeStamp:true
}

)
module.exports= mongoose.model("product",productSchema)