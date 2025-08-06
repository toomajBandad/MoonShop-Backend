const Review = require("../models/reviewModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");

// Get all reviews
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate("userId");
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Get review by ID
const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate("userId");
    if (!review) return res.status(404).json({ msg: "Review not found!" });
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Get reviews by user ID
const getReviewsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) return res.status(400).json({ msg: "User ID is required" });

    const checkUser = await User.findById(userId);
    if (!checkUser) return res.status(400).json({ msg: "User not found" });

    const reviews = await Review.find({ userId }).populate("productId");
    if (reviews.length === 0)
      return res.status(404).json({ msg: "No reviews found for this user" });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Create a new review
const createReview = async (req, res) => {
  try {
    const { userId, productId, rating, comment } = req.body;

    if (!userId || !productId || !rating) {
      return res.status(400).json({
        msg: "Missing required fields: userId, productId, rating",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({ msg: "Product not found" });
    }

    const existing = await Review.findOne({ userId, productId });
    if (existing) {
      return res
        .status(400)
        .json({ msg: "You’ve already reviewed this product." });
    }

    const newReview = await Review.create({
      userId,
      productId,
      rating,
      comment,
    });

    product.reviews.push(newReview._id);

    // Recalculate average rating
    const allReviews = await Review.find({ productId });
    const avgRating =
      allReviews.reduce((acc, cur) => acc + cur.rating, 0) / allReviews.length;

    product.ratings = avgRating;
    await product.save();

    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Update a review
const updateReviewItem = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ msg: "Review not found!" });

    const { rating, comment } = req.body;
    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    const updated = await review.save();
    res.status(200).json({ msg: "Review updated", review: updated });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  try {
    const deleted = await Review.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: "Review not found!" });
    res.status(200).json({ msg: "Review deleted" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  getReviews,
  getReviewById,
  getReviewsByUser,
  createReview,
  updateReviewItem,
  deleteReview,
};
