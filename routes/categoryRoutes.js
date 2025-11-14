const express = require("express");
const router = express.Router();

const {
  getCategories,
  getMainCategories,
  getSubcategories,
  getLeafCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

router.get("/", getCategories);
router.get("/main", getMainCategories);
router.get("/sub", getSubcategories);
router.get("/leaf", getLeafCategories);
router.get("/:id", getCategoryById);
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
