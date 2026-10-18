const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    brand: {
      type: String,
      trim: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    discountPrice: {
      type: Number,
      min: 0
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    images: {
      type: [String],
      default: []
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    }
  },
  {
    timestamps: true
  }
)

module.exports.Model = mongoose.model("Product", productSchema)