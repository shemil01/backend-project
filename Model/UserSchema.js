const { required } = require('joi')
const mongoos = require('mongoose')
const { type } = require('os')

const userSchema = new mongoos.schema({
    name:String,
    email:{
        type: String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        unique:true,
        required:true
    }
})
module.exports = mongoos.model("UserSchema",userSchema)