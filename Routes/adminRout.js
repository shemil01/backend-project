const express = require('express')
const Controller = require("../Controller/adminLogin")
const adminController = require('../Controller/adminForm')


const adminRoutes=express.Router()
const {tryCatch}=require('../Utils/tryCatch')
const { uploadImage } = require('../middleware/Cloudinary')


adminRoutes.post("/admin/login",tryCatch(Controller.getAdmin))
adminRoutes.get("/admin/allusers",tryCatch(adminController.allUsers))
// adminRoutes.get("/admin/allusers",tryCatch(adminController.allUsers))
adminRoutes.get('/admin/allproduct',tryCatch(adminController.viewProduct))
adminRoutes.get("/admin/productid/:id",tryCatch(adminController.viewProductById))
adminRoutes.get("/admin/category/:id",tryCatch(adminController.productByCategory))
adminRoutes.post("/admin/product",uploadImage,tryCatch(adminController.addProduct))
adminRoutes.put("/admin/update/:id",uploadImage,tryCatch(adminController.updateProduct))
adminRoutes.delete("/admin/delete/:id",tryCatch(adminController.deleteProduct))
adminRoutes.get("/admin/cart/:id",tryCatch(adminController.getCart))


module.exports = adminRoutes