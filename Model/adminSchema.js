const mongoos = require('mongoos')




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

module.exports=mongoos.model("adminSchema",adminSchema)