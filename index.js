const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({path:'./Config/.env'})
const multer = require("multer");
const cors = require("cors");
const product = require("./Model/product");
const DbConnect = require("./Config/DbConnection");
const adminRoute = require("./Routes/adminRout");
const userRoute = require('./Routes/userRout')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');


const app = express();

const port = process.env.port

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); // Add this line for URL-encoded bodies
app.use(cors()); // Enable CORS
app.use("/api", adminRoute);
app.use("/api",userRoute)
app.use(cookieParser())
DbConnect(); 
app.listen(process.env.port, () => {
  console.log(`your app is listening port:${port}`);
});
