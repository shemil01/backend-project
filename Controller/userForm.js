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
  confirmPass: joi.string().messages({
    "string.base": "password is required",
  }),
});

//user registration
const userRegister = async (req, res) => {
  const { email, name, password, confirmPass } = req.body;
  // const data = JSON.parse(req.body.data)

  const validate = await userValidation.validate({
    email,
    name,
    password,
    confirmPass,
  });
  if (!validate) {
    res.status(400).send("Error");
  }
  if (!(name && email && password && confirmPass)) {
    res.status(400).send("Fill all fields");
  }
  //check user is exist or not
  const userExist = await userSchema.findOne({ email });
  if (userExist) {
    res.status(401).json({ message: "User already exist" });
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
  // user.token = token;
  res.cookie("token", token);

  user.password = undefined;
  res.status(200).json({
    success: true,
    message: "Account created successfully",
  });
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
  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'None'
  });
  
  res.status(200).json({
    userData: userData,
    token: token,
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
  const { token } = req.cookies;
  const { productId } = req.body;


  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  if (!productId) {
    return res.status(400).json({
      success: false,
      message: "No product ID provided",
    });
  }
  const valid = await jwt.verify(token, process.env.jwt_secret);

  const userId = valid.id;

  let user = await cartSchema.findOne({ userId });

  if (!user) {
    user = new cartSchema({
      userId,
      cart: [{ productId: productId }],
    });
  } else {
    const itemIndex = user.cart.findIndex(
      (item) => item.productId.toString() === productId
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
  const { token } = req.cookies;
  // const { userId } = req.params;
  const valid = await jwt.verify(token, process.env.jwt_secret);

  const userId = valid.id;

  const user = await cartSchema
    .findOne({ userId: userId })
    .populate("cart.productId");
    console.log(user)
  if (!user || user.cart.length === 0) {
    res.status(404).json({
      success: false,
      message: "cart is empty",
    });
  }

  res.status(200).json(user);
};
//increse product quantity
const increseQuantity = async(req,res)=>{
  const { token } = req.cookies;
  const valid = jwt.verify(token, process.env.jwt_secret);
  const { productId } = req.params;
  const userId = valid.id;

  const user = await cartSchema.findOne({userId:userId})
  const itemIndex = user.cart.findIndex((item)=> item.productId == productId)
  if(itemIndex !== -1){
    user.cart[itemIndex].quantity += 1;
  }
  await user.save();
  res.status(200).send("Product quantity increased");
}


//decrease product quantity
const decreaseQuantity = async (req, res) => {
  const { token } = req.cookies;
  const valid = jwt.verify(token, process.env.jwt_secret);
  const { productId } = req.params;
  const userId = valid.id;

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
  const { token } = req.cookies;
  const valid = jwt.verify(token, process.env.jwt_secret);
  const { productId } = req.params;

  const userId = valid.id;

  const user = await cartSchema.findOne({ userId: userId });

  if (!user) {
    res.status(404).send("No product found in your cart");
  }

  const itemIndex = user.cart.findIndex((item) => item.productId == productId);

  if (itemIndex !== -1) {
    user.cart.splice(itemIndex, 1);

    await user.save();
    res.status(200).send("Product removed from cart");
  }
};

//add product to wish list
const addToWishlist = async (req, res) => {
  const { token } = req.cookies;
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
  const { token } = req.cookies;
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
  const { token } = req.cookies;
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

//buy from cart

const order = async (req, res) => {
  try {
    const { token } = req.cookies;
    const valid = jwt.verify(token, process.env.jwt_secret);
    const userId = valid.id;
    const cartData = await cartSchema.findOne({ userId: userId });

    // Check if the cart is empty
    if (!cartData || cartData.cart.length === 0) {
      return res.status(400).send("No product found in your cart");
    }

    const line_items = [];

    // Loop through the cart items and create line items for Stripe
    for (const cartItem of cartData.cart) {
      const product = await productSchema.findById(cartItem.productId);
      if (!product) {
        return res
          .status(404)
          .send(`Product with ID ${cartItem.productId} not found`);
      }

      line_items.push({
        price_data: {
          currency: "inr",
          product_data: {
            name: product.name,
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: cartItem.quantity,
      });            
    }

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: line_items,
      success_url: "https://react-e-commerce-project-eight.vercel.app/success",
      cancel_url: "https://react-e-commerce-project-eight.vercel.app",
    });

    const sessionId = session.id;
    const sessionUrl = session.url;

    // Set session cookie and send session URL
    res.cookie("session", sessionId);
    res.send(sessionUrl);
  } catch (error) {
    console.error(error);

    // Handle specific JWT errors
    if (error.name === "JsonWebTokenError") {
      return res.status(401).send("Invalid token signature");
    }

    // General error handling
    res.status(500).send("An error occurred while processing your order");
  }
};

// Buy cart items
const orderSuccess = async (req, res) => {
  const { session, token } = req.cookies;

  const valid = jwt.verify(token, process.env.jwt_secret);
  const userId = valid.id;

  res.clearCookie("session");

  const Cart = await cartSchema.findOne({ userId }).populate({
    path: "cart.productId",
    model: "product",
  });

  if (!Cart || Cart.cart.length === 0) {
    return res.status(200).send("No products found in your cart");
  }
  let totalItems = 0;
  let totalPrice = 0;

  Cart.cart.forEach((item) => {
    const quantity = item.quantity || 0;
    const price = item.productId.price || 0;

    totalItems += quantity;
    totalPrice += quantity * price;
  });

  // Create new Order
  const order = new OrderSchema({
    userId: Cart.userId,
    totalItems,
    totalPrice,
    orderId: `ORD${session}`,
  });

  Cart.cart.forEach((items) => {
    order.products.push({
      productId: items.productId._id,
      quantity: items.quantity,
    });
  });

  await order.save();

  Cart.cart = [];
  await Cart.save();

  res.status(200).send("Order placed successfully");
};

// order records

const orderRecords = async (req, res) => {
  const { token } = req.cookies;
  const { userId } = req.params;

  const orders = await OrderSchema.findOne({ userId });

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
  order,
  orderSuccess,
  orderRecords,
  increseQuantity
};
