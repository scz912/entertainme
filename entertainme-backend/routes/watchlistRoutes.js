const express = require("express");
const Watchlist = require("../models/Watchlist");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ADD TO WATCHLIST
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { itemId } = req.body;

    const existing = await Watchlist.findOne({
      userId: req.user.id,
      itemId
    });

    if (existing) {
      return res.status(400).json({ message: "Already in watchlist" });
    }

    const watchlist = await Watchlist.create({
      userId: req.user.id,
      itemId
    });

    res.status(201).json({
      message: "Added to watchlist",
      watchlist
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// VIEW MY WATCHLIST
router.get("/", authMiddleware, async (req, res) => {
  try {
    const watchlist = await Watchlist.find({ userId: req.user.id })
      .populate("itemId")
      .sort({ createdAt: -1 });

    res.json(watchlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// REMOVE FROM WATCHLIST
router.delete("/:itemId", authMiddleware, async (req, res) => {
  try {
    await Watchlist.findOneAndDelete({
      userId: req.user.id,
      itemId: req.params.itemId
    });

    res.json({ message: "Removed from watchlist" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;