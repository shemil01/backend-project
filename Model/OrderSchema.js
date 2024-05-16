const mongoose = require("mongoose");
const productSchema = require("./product");

const orders = mongoose.Schema({
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
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
    ref: "UserSchema",
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
