const mongoos = require('mongoose')




const adminSchema = new mongoos.schema({

    email:{
        type:String,
        required:true,
        unique:true
    },
    
    username:{
        type:String,
        unique:true
    },
    
    password:{
        type: String,
        reqired:true,
        unique:true
    }
})

module.exports=mongoos.model("AdminSchema",adminSchema)