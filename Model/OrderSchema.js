const mongoose = require("mongoose");
const productSchema = require("./product");

const orders = mongoose.Schema({
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  pusrchaseDate: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
},
totalItems:{
    type:Number,
    default:0
},
totlaPrice:{
    type:Number,
    default:0
},
orderId:{
    type:String
}
});
module.exports = mongoose.model("OrderSchema",orders)
