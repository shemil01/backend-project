const jwt = require('jsonwebtoken')

module.exports = function verifyToken (req,res,next){
    const token = req.headers['authorization']

    if(!token){
        res.status(403).json({
            success:false,
            message:"no token provide"
        })
    }
    jwt.verify(token,process.env.ACCES_TOKEN_SECRET,(err,decoded)=>{
        if(err){
            res.status(401).json({
                success:false,
                message:"Un authourized"
            })
        }
        req.email=decoded.email
        next()
    })
}