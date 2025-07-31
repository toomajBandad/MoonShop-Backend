const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: { type: Number, default: 1 },
});

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minLength: 6,
      maxLength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /.+\@.+\..+/, // Simple email regex pattern
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: false,
    },
    addressesList: {
      type: Array,
      required: false,
    },
    favoritesList: {
      type: Array,
      required: false,
    },
    couponsList: {
      type: Array,
      required: false,
    },
    creditBalance: {
      type: Number,
      required: false,
    },
    reviewsList: {
      type: Array,
      required: false,
    },
    ordersList: {
      type: Array,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
