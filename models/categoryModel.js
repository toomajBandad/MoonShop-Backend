const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    parentId: {
      //for nested categories
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    level: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
