const errorHandler =(error,req,res,next)=>{
    res.status(400).send(error,"Internal Server Error");
}

module.exports= errorHandler