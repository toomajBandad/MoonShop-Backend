const Order = require("../models/orderModel");
const Product = require("../models/productModel");

// Get all orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId")
      .populate("items.product");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product");
    if (!order) return res.status(404).json({ msg: "Order not found!" });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Get orders by user ID
const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ msg: "User ID is required" });
    }

    const orders = await Order.find({ userId }).populate({
      path: "items.product",
      model: "Product",
      select: "name brand price images category stock ratings",
    });

    if (orders.length === 0) {
      return res.status(404).json({ msg: "No orders found for this user" });
    }

    // orders.forEach((order) => {
    //   order.items.forEach((item) => {
    //     console.log(item);
    //   });
    // });

    orders.forEach((order) => {
      order.items.forEach((item) => {
        console.log(item.product); // should be full product object
      });
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ msg: error.message });
  }
};

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { userId, items, shippingAddress, paymentMethod, totalPrice } =
      req.body;

    if (
      !userId ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !shippingAddress?.address ||
      !paymentMethod ||
      !totalPrice
    ) {
      return res.status(400).json({ msg: "Missing required order fields" });
    }

    const newOrder = await Order.create({
      userId,
      items,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ msg: error.message });
  }
};

// Add item to order
const addToOrder = async (req, res) => {
  try {
    const { userId, productId, quantity, price } = req.body;
    let order = await Order.findOne({ userId });

    if (!order) order = new Order({ userId, items: [] });

    const item = order.items.find((i) => i.product.toString() === productId);
    if (item) {
      item.quantity += quantity;
    } else {
      order.items.push({ product: productId, quantity, price });
    }

    const saved = await order.save();
    res.status(200).json({ msg: "Item added", order: saved });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Update quantity or remove item
const updateOrderItem = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity } = req.body;

    const order = await Order.findOne({ userId });
    if (!order) return res.status(404).json({ msg: "Order not found!" });

    if (quantity === 0) {
      order.items = order.items.filter(
        (i) => i.product.toString() !== productId
      );
    } else {
      const item = order.items.find((i) => i.product.toString() === productId);
      if (item) item.quantity = quantity;
    }

    const updated = await order.save();
    res.status(200).json({ msg: "Order updated", order: updated });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Delete order
const deleteOrder = async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: "Order not found!" });
    res.status(200).json({ msg: "Order deleted" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  getOrders,
  getOrderById,
  getOrdersByUser,
  createOrder,
  addToOrder,
  updateOrderItem,
  deleteOrder,
};
