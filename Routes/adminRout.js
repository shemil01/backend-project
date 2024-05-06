const express = require('express')
const controller = require("../Controller/adminLogin")
const adminRoutes=express.Router()
const {tryCatch} = require('../Utils/tryCatch')



adminRoutes.post("/admin/login",tryCatch(controller.adminLogin))



module.exports = adminRoutes