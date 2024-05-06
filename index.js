const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const cors = require("cors");
const product = require("./Model/product");
const DbConnect = require("./Config/DbConnection");
const adminRoute= require("./Routes/adminRout")

const adminSchema = require("./Model/AdminSchema");

const app = express();
const port = 3010;

app.use(express.json());
app.use("/api",adminRoute)


DbConnect();
app.listen(port, () => {
  console.log(`your app is listening port:${port}`);
});
