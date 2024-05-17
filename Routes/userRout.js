const express = require('express')
const controller = require('../Controller/userForm')
const userRoutes = express.Router()
const{ tryCatch} = require('../Utils/tryCatch')
const userAuth = require('../middleware/userAuth')
const { uploadImage } = require('../middleware/Cloudinary')


userRoutes.post("/user/register",uploadImage, tryCatch(controller.userRegister))
userRoutes.post("/user/login",tryCatch(controller.userLogin))
userRoutes.get("/user/product",tryCatch(controller.viewProduct))
userRoutes.get("/user/productid/:id",tryCatch(controller.productById))
userRoutes.get("/user/category/:id",tryCatch(controller.productByCategory))
// userRoutes.post("/user/logout",tryCatch(controller.userLogout))
userRoutes.post("/user/addcart",userAuth,tryCatch(controller.addToCart))
userRoutes.get("/user/viewCart",userAuth,tryCatch(controller.getCart))
userRoutes.put("/user/decrease",userAuth,tryCatch(controller.decreaseQuantity))
userRoutes.delete("/user/remove",userAuth,tryCatch(controller.removeProduct))
userRoutes.post("/user/wishlist",userAuth,tryCatch(controller.addToWishlist))
userRoutes.get("/user/getWishlist",userAuth,tryCatch(controller.viewWishList))
userRoutes.delete("/user/removewishlist",userAuth,tryCatch(controller.removeWishlist))

module.exports = userRoutes