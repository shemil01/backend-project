const mongoos = require('mongoose')


const connectDb=async function(){
try{

    mongoos.connect("mongodb+srv://shemil:shemil01@atlascluster.8ivbdk1.mongodb.net//PLASHOE")
    .then(()=>{
        console.log("Data base connected");
    })
}catch(error){
    console.log(error);
    process.exit(1)
}
    
}
module.exports = connectDb
