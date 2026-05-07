const express = require("express");
const Item = require("../models/Item");

const router = express.Router();

// ADD SAMPLE ITEM
router.post("/", async (req, res) => {
  try {
    const item = await Item.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ALL ITEMS
router.get("/", async (req, res) => {
  try {
    const items = await Item.find().sort({ rating: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET TOP CHARTS
router.get("/top-charts", async (req, res) => {
  try {
    const items = await Item.find().sort({ rating: -1 }).limit(10);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET SINGLE ITEM
router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;