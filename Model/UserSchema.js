const mongoos = require('mongoose')
const { type } = require('os')

const userSchema = new mongoos.schema({
    name:String,
    email:{
        type: String,
        unique:true
    },
    password:{
        type:String,
        unique:true
    }
})
module.exports = mongoos.model("UserSchema",userSchema)