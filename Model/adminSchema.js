const mongoos = require('mongoose')




const adminSchema = new mongoos.Schema({

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
        required:true,
        unique:true
    }
})

module.exports=mongoos.model("Admin",adminSchema)