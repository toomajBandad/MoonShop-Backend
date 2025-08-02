const express = require("express");
const router = express.Router();

const {
  getOrders,
  getOrderById,
  getOrdersByUser,
  createOrder,
  addToOrder,
  updateOrderItem,
  deleteOrder,
} = require("../controllers/orderController");

router.get("/all", getOrders);
router.get("/:id", getOrderById);
router.get("/user/:userId", getOrdersByUser);
router.post("/", createOrder);
router.post("/add", addToOrder);
router.put("/user/:userId", updateOrderItem);
router.delete("/:id", deleteOrder);


module.exports = router;
