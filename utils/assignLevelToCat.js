const mongoose = require("mongoose");
const Category = require("../models/categoryModel"); // adjust path as needed


async function assignLevels() {
  const categories = await Category.find();
  const categoryMap = new Map();

  // Build a map for quick lookup
  categories.forEach(cat => {
    categoryMap.set(cat._id.toString(), cat);
  });

  // Recursive function to determine level
  function getLevel(cat) {
    if (!cat.parentId) return 0;
    const parent = categoryMap.get(cat.parentId.toString());
    return parent ? getLevel(parent) + 1 : 1;
  }

  // Update each category with its level
  for (const cat of categories) {
    const level = getLevel(cat);
    cat.level = level;
    await cat.save();
    console.log(`Updated ${cat.name} → level ${level}`);
  }

  console.log("✅ All categories updated with level.");
  mongoose.disconnect();
}

assignLevels().catch(err => {
  console.error("Error assigning levels:", err);
  mongoose.disconnect();
});