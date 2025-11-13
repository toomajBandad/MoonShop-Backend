const express = require("express");
const router = express.Router();

const {
  getReviews,
  getReviewById,
  getReviewsByUser,
  createReview,
  updateReviewItem,
  toggleReviewAcceptance,
  deleteReview,
  getReviewByUserProductOrder
} = require("../controllers/reviewController");

router.get("/all", getReviews);
router.get("/byId/:id", getReviewById);
router.get("/user/:userId", getReviewsByUser);
router.post("/", createReview);
router.put("/update/:id", updateReviewItem);
router.patch("/update/:id", toggleReviewAcceptance);
router.delete("/:id", deleteReview);
router.get("/find", getReviewByUserProductOrder);

module.exports = router;
