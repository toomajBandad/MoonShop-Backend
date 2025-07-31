const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const Tag = require("../models/tagModel");

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("tags");

    if (!product) {
      return res.status(404).json({ msg: "Product did not find" });
    }

    return res.status(201).json({ product });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getProductByCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ name: req.params.catName });

    if (!category) {
      return res.status(404).json({ msg: "category of product did not find" });
    }

    const productList = await Product.find({ category: category });

    return res.status(201).json({ productList });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getProductByTag = async (req, res) => {
  try {
    const tag = await Tag.findOne({ name: req.params.tagName.trim().toLowerCase() });

    if (!tag) {
      return res.status(404).json({ msg: "Tag is unknown" });
    }

    const productList = await Product.find({ tags: tag._id }).populate("tags");

    return res.status(200).json({ productList });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      desc,
      price,
      discount,
      sold,
      images,
      categoryId,
      stock,
      ratings,
      reviews,
    } = req.body;

    if (
      !name ||
      !brand ||
      !desc ||
      !price ||
      !discount ||
      !sold ||
      !categoryId ||
      !stock ||
      !ratings
    ) {
      return res
        .status(400)
        .json({ msg: "one or more product data did not send" });
    }

    const category = await Category.findById(categoryId);

    const newProduct = await Product.create({
      name,
      brand,
      desc,
      price,
      discount,
      sold,
      images,
      category,
      stock,
      ratings,
      reviews,
    });

    res.status(201).json({
      msg: "Product successfully created",
      newProduct,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      desc,
      price,
      discount,
      sold,
      images,
      category,
      stock,
      ratings,
      reviews,
    } = req.body;

    if (
      !name ||
      !brand ||
      !desc ||
      !price ||
      !discount ||
      !sold ||
      !images ||
      !category ||
      !stock ||
      !ratings ||
      !reviews
    ) {
      return res
        .status(400)
        .json({ msg: "one or more product data did not send" });
    }

    updateData = {
      name,
      brand,
      desc,
      price,
      discount,
      sold,
      images,
      category,
      stock,
      ratings,
      reviews,
    };
    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!product) {
      return res.status(404).json({ msg: "not updated,Product not found" });
    }
    res.status(201).json({ msg: "Product edited successfully", product });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: "Product did not find" });
    }

    res.json({ msg: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const assignTagsToProduct = async (req, res) => {
  try {
    const { tags } = req.body; // array of tag names
    const { id } = req.params;

    if (!Array.isArray(tags)) {
      return res.status(400).json({ msg: "You must send an array of tag names" });
    }

    const foundTags = await Tag.find({ name: { $in: tags } });

    if (!foundTags.length) {
      return res.status(404).json({ msg: "No matching tags found" });
    }

    const tagIds = foundTags.map(tag => tag._id);

    const product = await Product.findByIdAndUpdate(
      id,
      { tags: tagIds },
      { new: true, runValidators: true }
    );

    if (!product) return res.status(404).json({ msg: "Product not found" });

    res.json({ msg: "Tags assigned", product });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


module.exports = {
  getProducts,
  getProductById,
  getProductByCategory,
  getProductByTag,
  createProduct,
  updateProduct,
  deleteProduct,
  assignTagsToProduct,
};
