const express = require("express");
const router = express.Router();

const {
  getCarts,
  getCartById,
  getCartByuserId,
  createCart,
  addToCart,
  updateCart,
  deleteAllCartItems,
} = require("../controllers/cartController");

router.get("/all", getCarts);
router.get("/cart/:id", getCartById);
router.get("/user/:userId", getCartByuserId);
router.post("/newCart", createCart);
router.post("/add", addToCart);
router.put("/:userId", updateCart);
router.delete("/:id", deleteAllCartItems);

module.exports = router;
