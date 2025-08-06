const Cart = require("../models/cartModel");

const getCarts = async (req, res) => {
  try {
    const carts = await Cart.find({});
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getCartById = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);

    if (!cart) {
      return res.status(404).json({ msg: "Cart did not find !" });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getCartByuserId = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate(
      "items.product"
    );

    if (!cart) {
      return res.status(404).json({ msg: "Cart not found!" });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const createCart = async (req, res) => {
  try {
    const { user, items } = req.body;

    if (!user || !items) {
      return res
        .status(400)
        .json({ msg: "error : cartname, password or email not existed" });
    }

    const newCart = await Cart.create({
      user,
      items,
    });

    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    if (!userId || !productId || !quantity) {
      res.status(404).json({ message: "user or product data not sent" });
    }
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
    await cart.save();

    res.status(200).json({ message: "Item added to cart", cart });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update cart", details: err.message });
  }
};

const updateCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const { userId } = req.params;

    if (!productId || !userId) {
      return res
        .status(400)
        .json({ msg: "Missing productId, quantity or userId" });
    }

    let cart;

    if (quantity === 0) {
      cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(404).json({ msg: "Cart not found!" });
      }

      const newItems = cart.items.filter((item) => {
        return item._id.toString() !== productId;
      });

      cart = await Cart.findOneAndUpdate(
        { userId },
        { items: newItems },
        { new: true }
      );
    } else {
      cart = await Cart.findOneAndUpdate(
        { userId },
        { $set: { "items.$[elem].quantity": quantity } },
        {
          new: true,
          arrayFilters: [{ "elem.product": productId }],
        }
      );
    }

    if (!cart) {
      return res.status(404).json({ msg: "Cart not found!" });
    }

    return res.status(200).json({ msg: "Cart updated successfully", cart });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const deleteAllCartItems = async (req, res) => {
  try {
    const cart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        items: [],
      },
      {
        new: true,
      }
    );

    if (!cart) {
      return res.status(404).json({ msg: "Cart did not find !" });
    }

    res.json({ msg: "Cart deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  getCarts,
  getCartById,
  getCartByuserId,
  createCart,
  addToCart,
  updateCart,
  deleteAllCartItems,
};
