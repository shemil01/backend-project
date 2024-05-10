const express = require('express')
const controller = require('../Controller/userForm')
const userRoutes = express.Router()
const{ tryCatch} = require('../Utils/tryCatch')


userRoutes.post("/user/register",tryCatch(controller.userRegister))
userRoutes.post("/user/login",tryCatch(controller.userLogin))
userRoutes.get("/user/product",tryCatch(controller.viewProduct))
userRoutes.get("/user/Category",tryCatch(controller.viewProduct))


module.exports = userRoutes