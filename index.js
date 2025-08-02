const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const cartRoutes = require("./routes/cartRoutes");
const tagRoutes = require("./routes/tagRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
const port = process.env.PORT || 4000;

app.use(cors()); // Enable CORS for all requests
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
  })
  .catch((error) => {
    console.error("<❌ Error in connecting Mongo DB :>", error);
  });

//API Routes//
app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.use("/category", categoryRoutes);
app.use("/cart", cartRoutes);
app.use("/tag", tagRoutes);
app.use("/order", orderRoutes);

//welcome route
app.get("/", (req, res) => {
  res.json({
    mensaje: "Users and properties API",
    endpoints: {
      users: "/user",
      properties: "/product",
      category: "/category",
      cart: "/cart",
      cart: "/tag",
      cart: "/order",
    },
  });
});

const server = app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
