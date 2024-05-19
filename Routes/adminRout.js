const express = require("express");
const Controller = require("../Controller/adminLogin");
const adminController = require("../Controller/adminForm");

const adminRoutes = express.Router();
const { tryCatch } = require("../Utils/tryCatch");
const { uploadImage } = require("../middleware/Cloudinary");
const adminAuth = require("../middleware/adminAuth");

adminRoutes.post("/admin/login", tryCatch(Controller.getAdmin));
adminRoutes.get(
  "/admin/allusers",
  adminAuth,
  tryCatch(adminController.allUsers)
);
adminRoutes.get(
  "/admin/user/:id",
  adminAuth,
  tryCatch(adminController.userById)
);
adminRoutes.get(
  "/admin/allproduct",
  adminAuth,
  tryCatch(adminController.viewProduct)
);
adminRoutes.get(
  "/admin/productid/:id",
  adminAuth,
  tryCatch(adminController.viewProductById)
);
adminRoutes.get(
  "/admin/category/:id",
  adminAuth,
  tryCatch(adminController.productByCategory)
);
adminRoutes.post(
  "/admin/product",
  adminAuth,
  uploadImage,
  tryCatch(adminController.addProduct)
);
adminRoutes.put(
  "/admin/update/:id",
  adminAuth,
  uploadImage,
  tryCatch(adminController.updateProduct)
);
adminRoutes.delete(
  "/admin/delete/:id",
  adminAuth,
  tryCatch(adminController.deleteProduct)
);
adminRoutes.get(
  "/admin/cart/:id",
  adminAuth,
  tryCatch(adminController.getCart)
),
  adminRoutes.get("/admin/orders/:userId", adminAuth, tryCatch(adminController.orders));

module.exports = adminRoutes;
