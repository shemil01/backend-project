const mongoos = require('mongoose')

mongoos.connect("mongodb://localhost:27017/PLASHOE")
.then(()=>{
    console.log("Data base connected");
})