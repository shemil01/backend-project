const mongoos = require('mongoose')


const connectDb=async function(){
try{

    mongoos.connect("mongodb://localhost:27017/PLASHOE")
    .then(()=>{
        console.log("Data base connected");
    })
}catch(error){
    console.log(error);
    process.exit(1)
}
    
}
module.exports = connectDb
