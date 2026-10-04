const upload = require("../midllware/upload.js");
const express = require("express");

const {
    createCategory,
    getAllCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory,
} = require("../controllers/categoryController.js");

const {isAuthenticated,isAdmin} = require("../midllware/isAuthenticated.js");

const router = express.Router();


// ===============================
// Public Routes
// ===============================

// Get All Categories
router.get("/all", getAllCategories);

// Get Single Category
router.get("/:id", getSingleCategory);


// ===============================
// Admin Routes
// ===============================

// Create Category
router.post(
    "/create",
    isAuthenticated,
    isAdmin,
    upload.single("CategoryImage"),
    createCategory
);

// Update Category
router.put(
    "/update/:id",
    isAuthenticated,
    isAdmin,
    upload.single("CategoryImage"),
    updateCategory
);

// Delete Category
router.delete(
    "/delete/:id",
    isAuthenticated,
    isAdmin,
    deleteCategory
);


module.exports = router;
