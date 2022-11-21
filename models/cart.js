const mongoose = require("mongoose");

const Schema = mongoose.Schema;

var CartSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  total: { type: Number, default: 0 },
  item: [
    {
      item: { type: Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 0 },
      price: { type: Number, default: 0 },
    },
  ],
});

module.exports = mongoose.model("Cart", CartSchema);
