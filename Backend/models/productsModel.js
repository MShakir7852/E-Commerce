const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    discountPrice: {
        type: Number,
        required: true,
        default: 0
    },
      stock: {
        type: Number,
        required: true,
        default: 0
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  
    isActive: {
        type: Boolean,
        default: true
    },
    productImage: {
        type: String,
        required: true
    },

}, {
    timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);
