const errorHandler =(error,req,res,next)=>{
    res.status(500).send(error,"Internal Server Error");
}

module.exports= errorHandler