import upload from "../middleware/upload.js";
const express = require("express");

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const {
    isAuthenticated,
    isAdmin
} = require("../midllware/isAuthenticated");
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();


// ===============================
// Admin Product Routes
// ===============================

// Create Product
router.post(
    "/create",
    isAuthenticated,
    isAdmin,
    upload.single("image"),
    createProduct
);

// Get All Products
router.get(
    "/all",
    getAllProducts
);

// Get Single Product
router.get(
    "/:id",
    getProductById
);

// Update Product
router.put(
    "/update/:id",
    isAuthenticated,
    isAdmin,
    upload.single("image"),
    updateProduct
);

// Delete Product
router.delete(
    "/delete/:id",
    isAuthenticated,
    isAdmin,
    deleteProduct
);


module.exports = router;
