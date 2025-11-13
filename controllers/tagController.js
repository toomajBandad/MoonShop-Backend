const mongoose = require("mongoose");
const Tag = require("../models/tagModel");

const getTags = async (req, res) => {
  try {
    const tags = await Tag.find({});
    res.json(tags);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getTagById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid tag ID format" });
    }

    const tag = await Tag.findById(id);
    if (!tag) {
      return res.status(404).json({ msg: "Tag not found" });
    }

    return res.status(200).json(tag);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const createTag = async (req, res) => {
  try {
    const rawName = req.body.name;

    if (!rawName) {
      return res.status(400).json({ error: "Tag name is required" });
    }

    const name = rawName.toLowerCase().trim();

    const existing = await Tag.findOne({ name });
    if (existing) {
      return res.status(409).json({ error: "Tag already exists" });
    }

    const newTag = await Tag.create({ name });

    res.status(201).json(newTag);
  } catch (err) {
    console.error("Error creating tag:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const updateTag = async (req, res) => {
  try {
    const rawName = req.body.name;

    if (!rawName) {
      return res.status(400).json({ msg: "Tag name is required" });
    }

    const name = rawName.toLowerCase().trim();

    const tag = await Tag.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );

    if (!tag) {
      return res.status(404).json({ msg: "Tag not found" });
    }

    res.json({ msg: "Tag edited", tag });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const deleteTag = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: "Invalid tag ID" });
    }

    const tag = await Tag.findByIdAndDelete(req.params.id);

    if (!tag) {
      return res.status(404).json({ msg: "Tag not found" });
    }

    res.json({ msg: "Tag deleted successfully", tag });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};


module.exports = {
  getTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
};
