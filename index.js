const express = require('express')
const path = require('path')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const cors = require('cors')
const app = express()
const port = 3010

const product =require('./Model/product')

app.use(express.json())


app.listen(port,()=>{
    console.log(`your app is listening port:${port}`);
})