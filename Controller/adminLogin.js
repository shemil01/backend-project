const adminSchema = require("../Model/AdminSchema")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const adminLogin = async ( req,res)=>{
    const {email,password} = req.body;
    const admin =await adminSchema.findOne({email:userId})
    if(!admin){
    return res.status(404).send("admin not found")

    }
    const passwordMatch = await bcrypt.compare(password,admin.password)
    if(!passwordMatch){
        return res.status(401).send("incorrect password")
    }
    const token = jwt.sign({email:email.admin},process.env.ACCES_TOKEN_SCRET)
    res.json({message:"login succesfull",token})
}