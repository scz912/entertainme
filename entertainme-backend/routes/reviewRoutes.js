const express = require("express");
const Review = require("../models/Review");
const Item = require("../models/Item");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ADD REVIEW
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { itemId, rating, comment } = req.body;

    // Check item exists
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const review = await Review.create({
      userId: req.user.id,
      itemId,
      rating,
      comment
    });


    // Recalculate rating
    const reviews = await Review.find({ itemId });

    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = Math.round((total / reviews.length) * 10) / 10;

    // Update item
    await Item.findByIdAndUpdate(itemId, {
      rating: avgRating,
      totalReviews: reviews.length
    });

    res.status(201).json({
      message: "Review added successfully",
      review
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET REVIEWS BY ITEM
router.get("/item/:itemId", async (req, res) => {
  try {
    const reviews = await Review.find({ itemId: req.params.itemId })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    if (!reviews.length) {
      return res.status(404).json({ message: "Reviews for this item is empty" });
    }

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET MY REVIEWS
router.get("/my-reviews", authMiddleware, async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user.id })
      .populate("itemId")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;