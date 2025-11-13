const Category = require("../models/categoryModel");

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).populate("parentId");
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ msg: "category not found" });
    }

    return res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, desc, parentId } = req.body;

    if (!name || !desc) {
      return res.status(400).json({ msg: "error on name or desc" });
    }

    const newCategory = await Category.create({ name, desc, parentId });

    res.status(201).json({
      msg: "Category crteated successfully",
      id: newCategory._id,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, desc, parentId } = req.body;

    if (!name || !desc) {
      return res.status(400).json({ msg: "error on name or desc" });
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, desc, parentId },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ msg: "category not found" });
    }

    res.json({ msg: "category edited", category });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ msg: "category no encontrado" });
    }

    res.json({ msg: "category deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
