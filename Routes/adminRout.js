const express = require("express");
const Controller = require("../Controller/adminLogin");
const adminController = require("../Controller/adminForm");
const adminSchema = require("../Model/AdminSchema")
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
  "/admin/add",
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
  adminRoutes.get(
    "/admin/orders",
    adminAuth,
    tryCatch(adminController.orders)
  );
  adminRoutes.get(
    "/admin/ordersid/:userId",
    adminAuth,
    tryCatch(adminController.ordersById)
  );

adminRoutes.get(
  "/admin/revenue",
  adminAuth,
  tryCatch(adminController.totalRevenue)
);   
adminRoutes.get(          
  "/admin/totalPurchase",
  adminAuth,
  tryCatch(adminController.totalPurchase)
);

adminRoutes.all("/admin/refresh-token", tryCatch(Controller.generateToken));

module.exports = adminRoutes;
