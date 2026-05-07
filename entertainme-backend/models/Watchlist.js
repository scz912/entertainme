const mongoose = require("mongoose");

const watchlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true
    }
  },
  { versionKey: false },
  { timestamps: true }
);

module.exports = mongoose.model("Watchlist", watchlistSchema);