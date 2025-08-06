const express = require("express");
const router = express.Router();

const {
  getReviews,
  getReviewById,
  getReviewsByUser,
  createReview,
  updateReviewItem,
  deleteReview,
} = require("../controllers/reviewController");

router.get("/all", getReviews);
router.get("/byId/:id", getReviewById);
router.get("/user/:userId", getReviewsByUser);
router.post("/", createReview);
router.put("/review/:id", updateReviewItem);
router.delete("/:id", deleteReview);


module.exports = router;
