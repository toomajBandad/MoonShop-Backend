const Order = require("../models/orderModel");

// ✅ Get all orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ✅ Get order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: "Order not found!" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ✅ Get orders by userId (multiple)
const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    res.status(500).json({ message: "Unable to retrieve orders" });
  }
};

// ✅ Get single order by userId with populated items
const getOrderByUserId = async (req, res) => {
  try {
    const order = await Order.findOne({ userId: req.params.userId }).populate("items.product");
    if (!order) {
      return res.status(404).json({ msg: "Order not found!" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ✅ Create a new order
const createOrder = async (req, res) => {
  try {
    const { userId, items, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (!userId || !items || !Array.isArray(items) || items.length === 0 || !totalPrice || !paymentMethod) {
      return res.status(400).json({ msg: "Missing or invalid order fields" });
    }

    const newOrder = new Order({ userId, items, shippingAddress, paymentMethod, totalPrice });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ message: "Something went wrong while creating the order" });
  }
};

// ✅ Add product to an existing order
const addToOrder = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    if (!userId || !productId || typeof quantity !== "number") {
      return res.status(400).json({ message: "Invalid user or product data" });
    }

    let order = await Order.findOne({ userId });

    if (!order) {
      order = new Order({ userId, items: [] });
    }

    const existingItem = order.items.find(item => item.product.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      order.items.push({ product: productId, quantity });
    }

    await order.save();
    res.status(200).json({ message: "Item added to order", order });
  } catch (err) {
    res.status(500).json({ error: "Failed to update order", details: err.message });
  }
};

// ✅ Update order's item quantity or remove item
const updateOrder = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const { userId } = req.params;

    if (!productId || typeof quantity !== "number" || !userId) {
      return res.status(400).json({ msg: "Missing productId, quantity or userId" });
    }

    let order = await Order.findOne({ userId });
    if (!order) {
      return res.status(404).json({ msg: "Order not found!" });
    }

    if (quantity === 0) {
      order.items = order.items.filter(item => item.product.toString() !== productId);
    } else {
      const itemToUpdate = order.items.find(item => item.product.toString() === productId);
      if (itemToUpdate) {
        itemToUpdate.quantity = quantity;
      }
    }

    await order.save();
    return res.status(200).json({ msg: "Order updated successfully", order });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ✅ Delete order by ID
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: "Order not found!" });
    }
    res.json({ msg: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  getOrders,
  getOrderById,
  getOrdersByUser,
  getOrderByUserId,
  createOrder,
  addToOrder,
  updateOrder,
  deleteOrder,
};