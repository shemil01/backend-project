const productSchema = require("../Model/product");
const { tryCatch } = require("../Utils/tryCatch");
const joi = require("joi");
const cloudinary = require("cloudinary").v2;
const orderSchema = require("../Model/OrderSchema");
const UserSchema = require("../Model/UserSchema");
const cartSchema = require("../Model/CartSchema");

//joi validation
const schema = joi.object({
  name: joi.string().messages({
    "name.empty": "name is required",
  }),
  price: joi.number().messages({
    "price.base": "price must be number",
  }),
  description: joi.string().messages({
    "description.base": "Description must be string",
    "description.empty": "Description cannot empty",
  }),
  image: joi.string().messages({
    "image.base": "image url must be string ",
  }),
  category: joi.string().messages({
    "category.base": "category musst be a string",
  }),
});

//view all users
const allUsers = async (req, res) => {
  const users = await UserSchema.find();
  if (users.length === 0) {
    res.status(401).json({
      success: true,
      message: "Users is empty",
    });
  } else {
    res.status(201).json(users);
  }
};

//view users by id
const userById = async (req, res) => {
  const userId = req.params.id;
  const user = await UserSchema.findById(userId);
  if (!user) {
    res.status(401).json({
      success: false,
      message: "User not found the specified id",
    });
  } else {
    res.status(201).json(user);
  }
};

//view user cart
const getCart = async (req, res) => {
  const userId = req.params.id;
  console.log(userId);
  const Cart = await cartSchema
    .findOne({ userId: userId })
    .populate("cart.productId");

  if (!Cart || Cart.cart.length === 0) {
    return res.status(401).send("Cart is empty");
  }
  return res.status(201).json(Cart);
};

//view all products

const viewProduct = async (req, res) => {
  const product = await productSchema.find();
  if (product.length == 0) {
    res.status(404).send("product is empty");
  } else {
    res.json(product);
  }
};

//view product by ID

const viewProductById = async (req, res) => {
  const productId = req.params.id;
  const product = await productSchema.findById(productId);

  if (!product) {
    res.status(404).json({
      success: false,
      message: "Product not found",
    });
  } else {
    res.status(200).json(product);
  }
};

//view product by category
const productByCategory = async (req, res) => {
  const category = req.params.id;
  const productInCategory = await productSchema.aggregate([
    { $match: { category: category } },
  ]);
  if (productInCategory.length == 0) {
    res.status(404).json({
      successa: false,
      message: "product not found in specified category",
    });
  } else {
    res.status(200).json(productInCategory);
  }
};

//add product
const addProduct = async (req, res) => {
  const data = req.body;
  data.image = req.cloudinaryImageUrl;
  //  console.log( req.cloudinaryImageUrl);
  const { name, description, price, image, category } = data;
  const validate = await schema.validate(data);
  if (!validate) {
    res.status(400).send("Product not validated");
  }
  const existingProduct = await productSchema.findOne({ name: name });
  if (existingProduct) {
    return res.status(400).json({
      success: false,
      message: "Product with same name is already exist",
    });
  }

  const newProduct = await new productSchema({
    name: data.name,
    price: data.price,
    category: data.category,
    image: req.cloudinaryImageUrl,
  });
  await newProduct.save();
  res.status(200).send("Product added successfully compleated");
};

//update product

const updateProduct = async (req, res) => {
  const { id } = req.params;

  const data = req.body;

  const { name, category, description, price, image } = data;
  const { error } = schema.validate(data);
  if (error) {
    res.status(400).send({ message: error.details[0].message });
  }
  const product = await productSchema.findById(id);

  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found " });
  }
  product.image = req.cloudinaryImageUrl;

  await productSchema.findByIdAndUpdate(
    { _id: id },
    {
      name: name,
      category: category,
      image: req.cloudinaryImageUrl,
      price: price,
      description: description,
    }
  );
  res.status(201).json({
    success: true,
    message: "Product updated ",
  });
};
//Delete product
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const deleted = await productSchema.findByIdAndDelete(id);
  if (!deleted) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }
  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
};

module.exports = {
  viewProduct,
  viewProductById,
  productByCategory,
  addProduct,
  updateProduct,
  deleteProduct,
  allUsers,
  userById,
  getCart,
};
