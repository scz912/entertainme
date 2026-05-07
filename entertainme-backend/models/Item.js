const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    type: {
      type: String,
      enum: ["movie", "music", "book"],
      required: true
    },

    genre: {
      type: String,
      required: true
    },

    year: {
      type: Number,
      required: true
    },

    rating: {
      type: Number,
      default: 0
    },

    image: {
      type: String
    },

    description: {
      type: String
    },

    length: {
      type: String
    }
  },
  { versionKey: false },
  { timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);