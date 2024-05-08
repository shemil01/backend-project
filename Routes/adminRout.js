const express = require('express')
const controller = require("../Controller/adminLogin")
const adminController = require('../Controller/adminForm')


const adminRoutes=express.Router()
const {tryCatch}=require('../Utils/tryCatch')


adminRoutes.post("/admin/login",tryCatch(controller.getAdmin))
adminRoutes.get('/admin/allproduct',tryCatch(adminController.viewProduct))
adminRoutes.get("/admin/productbyid",tryCatch(adminController.viewProductById))
adminRoutes.get("/admin/productcategory",tryCatch(adminController.productByCategory))
adminRoutes.post("/admin/addproduct",tryCatch(adminController.addProduct))



module.exports = adminRoutes