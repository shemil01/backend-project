const userSchema = require('../Model/UserSchema')
const bcrypt = require('bcryptjs')

//user registration

const userRegister = async (req,res)=>{
    try{
        const {name,email,password}=req.body
    }catch(error){
        return res.status(400).send( error,"")
    }
}