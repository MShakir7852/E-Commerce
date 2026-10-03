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
        type: String,
        required: true,
        default: "0"
    },
    discountPrice: {
        type: String,
        required: true,
        default: "0"
    },
      stock: {
        type: String,
        required: true,
        default: "0"
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  
    isActive: {
        type: Boolean,
        default: true
    },
    productImage: {
        type: String,
        default: ""
    },

}, {
    timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);
