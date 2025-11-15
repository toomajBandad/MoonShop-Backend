const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const Tag = require("../models/tagModel");

const getProducts = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      minDiscount,
      maxDiscount,
      minRate,
      maxRate,
    } = req.query;

    const filter = {};

    // Filter by category name
    if (category) {
      const foundCategory = await Category.findOne({ name: category });
      if (foundCategory) {
        filter.category = foundCategory._id;
      }
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Filter by discount range
    if (minDiscount || maxDiscount) {
      filter.discount = {};
      if (minDiscount) filter.discount.$gte = Number(minDiscount);
      if (maxDiscount) filter.discount.$lte = Number(maxDiscount);
    }

    // Filter by rating range
    if (minRate || maxRate) {
      filter.ratings = {};
      if (minRate) filter.ratings.$gte = Number(minRate);
      if (maxRate) filter.ratings.$lte = Number(maxRate);
    }

    const products = await Product.find(filter).populate("tags");

    res.json(products);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate("tags");

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    return res.status(200).json({ product });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Internal server error", error: error.message });
  }
};

const getProductByCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ name: req.params.catName });

    if (!category) {
      return res.status(404).json({ msg: "Category not found" });
    }

    const productList = await Product.find({ category: category._id }).populate(
      "tags"
    );

    return res.status(200).json({ productList });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Internal server error", error: error.message });
  }
};

const getProductByTag = async (req, res) => {
  try {
    const rawTag = req.params.tagName;
    const normalizedTag =
      typeof rawTag === "string" ? rawTag.trim().toLowerCase() : "";

    const tag = await Tag.findOne({ name: normalizedTag });

    if (!tag) {
      return res.status(404).json({ msg: "Tag not found" });
    }

    const productList = await Product.find({ tags: tag._id }).populate("tags");

    return res.status(200).json({ productList });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Internal server error", error: error.message });
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
      tags,
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

    const existingProduct = await Product.findOne({
      name: name.trim().toLowerCase(),
    });
    if (existingProduct) {
      return res.status(409).json({ msg: "Product already exists" });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ msg: "Category not found" });
    }

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
      tags,
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
      tags,
    } = req.body;

    if (!name || !brand || !desc || !price || !images || !stock) {
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
      tags,
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
      return res
        .status(400)
        .json({ msg: "You must send an array of tag names" });
    }

    const foundTags = await Tag.find({ name: { $in: tags } });

    if (!foundTags.length) {
      return res.status(404).json({ msg: "No matching tags found" });
    }

    const tagIds = foundTags.map((tag) => tag._id);

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
