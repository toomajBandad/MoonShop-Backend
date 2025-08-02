const express = require("express");
const router = express.Router();

const {
  getOrders,
  getOrderById,
  // getOrdersByUser,
  getOrderByUserId,
  createOrder,
  addToOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

router.get("/all", getOrders);
router.get("/order/:id", getOrderById);
// router.get("/user/:userId", getOrdersByUser);
router.get("/user/:userId", getOrderByUserId);
router.post("/newOrder", createOrder);
router.post("/add", addToOrder);
router.put("/:userId", updateOrder);
router.delete("/:id", deleteOrder);

module.exports = router;
