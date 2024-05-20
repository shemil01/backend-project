const userSchema = require("../Model/UserSchema");
const productSchema = require("../Model/product");
const bcrypt = require("bcryptjs");
const joi = require("joi");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cartSchema = require("../Model/CartSchema");
const wishListSchema = require("../Model/wishListSchema");
const Order = require("../Model/OrderSchema");
const OrderSchema = require("../Model/OrderSchema");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

//joi validation for user
const userValidation = joi.object({
  name: joi.string().required().messages({
    "string.base": "Name is required",
  }),
  email: joi.string().email().messages({
    "string.base": "Email is required",
    "string.pattern.base": "Email must be in format",
  }),
  password: joi.string().messages({
    "string.base": "password is required",
  }),
});

//user registration
const userRegister = async (req, res) => {
  const { email, name, password } = req.body;
  const validate = await userValidation.validate({ email, name, password });
  if (!validate) {
    res.status(400).send("Error");
  }
  if (!(name && email && password)) {
    res.status(400).send("Fill all fields");
  }
  //check user is exist or not
  const userExist = await userSchema.findOne({ email });
  if (userExist) {
    res.status(401).send("User already exist");
  }

  //password bcrypt

  const hashPassword = await bcrypt.hash(String(password), 10);
  //save user
  const user = await userSchema.create({
    name,
    email,
    password: hashPassword,
  });

  //generate token

  const token = jwt.sign({ id: user._id }, process.env.jwt_secret, {
    expiresIn: "2h",
  });
  user.token = token;
  user.password = undefined;
  res.status(200).json(user);
};

//user login
const userLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    res.status(400).send("Please fill email and password");
  }
  const userData = await userSchema.findOne({ email });
  if (!userData) {
    return res.status(400).json({
      success: false,
      message: "User not  found",
    });
  }
  const passwordMatch = await bcrypt.compare(
    String(password),
    userData.password
  );

  if (!passwordMatch) {
    return res.status(400).json({
      success: false,
      message: "Incorrect password",
    });
  }

  const token = jwt.sign({ id: userData._id }, process.env.jwt_secret, {
    expiresIn: "2h",
  });

  // res.cookies = token;
  res.status(200).json({
    token: token,
    userData: userData,
    message: "login successfull",
  });
};

//view product
const viewProduct = async (req, res) => {
  const product = await productSchema.find();
  if (product.length === 0) {
    res.status(400).json({
      success: false,
      message: "Product is empty",
    });
  } else {
    res.status(200).json(product);
  }
};

//view product by Id
const productById = async (req, res) => {
  const productId = req.params.id;
  const product = await productSchema.findById(productId);
  if (!product) {
    res.status(401).json({
      success: false,
      message: "Product not found",
    });
  }
  res.status(200).json(product);
};

//view product by category

const productByCategory = async (req, res) => {
  const category = req.params.id;
  const productInCategory = await productSchema.aggregate([
    {
      $match: { category: category },
    },
  ]);
  if (productInCategory.length === 0) {
    res.status(400).json({
      success: false,
      message: "Product not found in specified category",
    });
  } else {
    res.status(200).json(productInCategory);
  }
};
//add to cart

const addToCart = async (req, res) => {
  const { productId, userId } = req.body;

  let user = await cartSchema.findOne({ userId });

  if (!user) {
    user = new cartSchema({
      userId,
      cart: [{ productId: productId }],
    });
  } else {
    const itemIndex = user.cart.findIndex(
      (item) => item.productId == productId
    );

    if (itemIndex !== -1) {
      user.cart[itemIndex].quantity += 1;
    } else {
      user.cart.push({ productId });
    }
  }
  await user.save();
  res.status(200).json({
    success: true,
    message: "Product added to cart",
  });
};

//view  cart
const getCart = async (req, res) => {
  const { userId } = req.body;
  const user = await cartSchema
    .findOne({ userId: userId })
    .populate("cart.productId");
  if (!user || user.cart.length === 0) {
    res.status(404).json({
      success: false,
      message: "cart is empty",
    });
  }
  res.status(200).json(user);
};
//decrease product quantity
const decreaseQuantity = async (req, res) => {
  const { productId, userId } = req.body;
  const user = await cartSchema.findOne({ userId: userId });
  if (!user) {
    res.status(404).send("Product Not Found In Your Cart");
  }
  const itemIndex = user.cart.findIndex((item) => item.productId == productId);
  if (itemIndex !== -1) {
    user.cart[itemIndex].quantity -= 1;
  }
  await user.save();
  res.status(200).send("Product quantity decreased");
};

//delete from cart

const removeProduct = async (req, res) => {
  const { userId, productId } = req.body;

  const user = await cartSchema.findOne({ userId: userId });

  if (!user) {
    res.status(404).send("No product found in your cart");
  }

  const itemIndex = user.cart.findIndex((item) => item.productId == productId);

  if (itemIndex !== -1) {
    user.cart.splice(itemIndex, 1);
  }
  await user.save();
  res.status(200).send("Product removed from cart");
};

//add product to wish list
const addToWishlist = async (req, res) => {
  const { productId, userId } = req.body;
  let addWishList = await wishListSchema.findOne({ userId });

  if (!addWishList) {
    addWishList = new wishListSchema({
      userId,
      wishlist: [{ productId: productId }],
    });
    await addWishList.save();
    res.send("Product added to your wishList");
  }

  const itemIndex = addWishList.wishlist.findIndex(
    (item) => item.productId == productId
  );

  if (itemIndex === -1) {
    addWishList.wishlist.push({ productId });
    await addWishList.save();
    res.send("Product added to your wishList");
  }

  res.send("Product already exist in wishlist");

  res.status(200).json({
    success: true,
    message: "Product added to wishlist",
  });
};
// read wishlist

const viewWishList = async (req, res) => {
  const { userId } = req.body;

  const user = await wishListSchema
    .findOne({ userId: userId })
    .populate("wishlist.productId");

  if (!user || user.wishlist.length === 0) {
    res.status(404).send("No product found in your wishlist");
  }
  res.status(200).json(user);
};

//remove wishlist
const removeWishlist = async (req, res) => {
  const { userId, productId } = req.body;

  const wishList = await wishListSchema.findOne({ userId });
  if (!wishList) {
    res.status(404).json({
      success: false,
      message: "No item found in your wishlist",
    });
  }
  const itemIndex = wishList.wishlist.findIndex(
    (item) => item.productId == productId
  );
  if (itemIndex === -1) {
    res.send("Item not found in your wishList");
  }
  wishList.wishlist.splice(itemIndex, 1);
  await wishList.save();
  res.send("item removed");
};

// Buy cart items
const buyProduct = async (req, res) => {
  const { userId } = req.params;

  const Cart = await cartSchema.findOne({ userId }).populate("cart.productId");

  if (!Cart || Cart.cart.length === 0) {
    return res.status(404).send("No products found in your cart");
  }
  let totalItems = 0;
  let totalPrice = 0;

  Cart.cart.forEach((item) => {
    const quantity = item.quantity || 0;
    const price = item.productId.price || 0;

    totalItems += quantity;
    totalPrice += quantity * price;
  });

  // Validate totalPrice to prevent NaN values
  // if (isNaN(totalPrice)) {
  //   return res.status(400).send("Invalid price calculation");
  // }

  // Create new Order
   order = new OrderSchema({
    products: Cart.cart,
    userId: Cart.userId,
    totalItems,
    totalPrice,
    orderId: `ORD-${Date.now()}`,
  });

  await order.save();
  console.log(order);

  Cart.cart = [];
  await Cart.save();

  res.status(200).send("Order placed successfully");
};

// order records

const orderRecords = async (req, res) => {
  const { userId } = req.params;

  const orders = await Order.findOne({ userId });

  if (!orders) {
    res.status(404).send("No order records");
  }

  res.status(200).json(orders);
};

module.exports = {
  userRegister,
  userLogin,
  viewProduct,
  productByCategory,
  productById,
  addToCart,
  addToWishlist,
  removeWishlist,
  getCart,
  decreaseQuantity,
  removeProduct,
  viewWishList,
  buyProduct,
  orderRecords,
};
