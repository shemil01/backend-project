const mongoos = require('mongoos')

mongoos.connect("mongodb://localhost:27017/PLASHOE")
.then(()=>{
    console.log("Data base connected");
})