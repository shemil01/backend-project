const userSchema = require("../Model/UserSchema");
const productSchema = require("../Model/product");
const bcrypt = require("bcryptjs");
const joi = require("joi");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cartSchema = require("../Model/CartSchema");
const wishListSchema = require("../Model/wishListSchema");

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

// //logout
// const userLogout = tryCatch(async (req, res) => {
//   const data = req.body;

//   res.clearCookie("token");
//   res.status(200).json({
//     success: true,
//     message: "Logout successfully",
//   });
// });

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
  const { productId, userId, quantity } = req.body;

  let Cart = await cartSchema.findOne({ userId });
  console.log(productId);
  if (!Cart) {
    Cart = new cartSchema({
      userId,
      cart: [{ productId: productId, quantity: quantity }],
    });
  } else {
    const itemIndex = Cart.cart.findIndex((item) => item.id === productId);
    if (itemIndex !== -1) {
      Cart.cart[itemIndex].quantity += quantity;
    } else {
      Cart.cart.push({ productId, quantity });
    }
  }
  await Cart.save();
  res.status(200).json({
    success: true,
    message: "Product added to cart",
  });
};

//view  cart
const getCart = async (req, res) => {
  const { userId } = req.params.id;
  const Cart = await cartSchema
    .findOne({ userId: userId })
    .populate("cart.productId");
  if (!Cart || Cart.cart.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Cart is empty",
    });
  }
  res.status(200).json(Cart);
};

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

//

module.exports = {
  userRegister,
  userLogin,
  viewProduct,
  productByCategory,
  productById,
  addToCart,
  addToWishlist,
  removeWishlist,
  getCart
};
