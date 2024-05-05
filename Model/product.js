const mongoos=require('mongoose')

const productSchema = new mongoos.Schema({
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
module.export= mongoos.model("product",productSchema)