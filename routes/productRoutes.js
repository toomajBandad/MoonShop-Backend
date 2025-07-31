const express = require("express");
const router = express.Router();

const {
  getProducts,
  getProductById,
  getProductByCategory,
  getProductByTag,
  createProduct,
  updateProduct,
  deleteProduct,
  assignTagsToProduct,
} = require("../controllers/productController");

router.get("/all", getProducts);
router.get("/byId/:id", getProductById);
router.get("/byCat/:catName", getProductByCategory);
router.get("/byTag/:tagName", getProductByTag);
router.post("/", createProduct);
router.put("/update/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.put("/asignTags/:id", assignTagsToProduct);

module.exports = router;
