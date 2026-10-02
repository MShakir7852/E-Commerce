
const Category = require("../models/categoryModel.js");

// ===============================
// Create Category
// ===============================
const createCategory = async (req, res) => {
    try {
        const image = req.file ? req.file.path : null;
        const { name, slug, description } = req.body;

        if (!name || !slug) {
            return res.status(400).json({
                success: false,
                message: "Category name and slug are required",
            });
        }

        // Check duplicate category
        const existingCategory = await Category.findOne({
            $or: [{ name }, { slug }],
        });

        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: "Category already exists",
            });
        }

        const category = await Category.create({
            name,
            slug,
            description,
            image,
        });

        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            category,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create category",
            error: error.message,
        });
    }
};


// ===============================
// Get All Categories
// ===============================
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find()
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: categories.length,
            categories,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to get categories",
            error: error.message,
        });
    }
};


// ===============================
// Get Single Category
// ===============================
const getSingleCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        return res.status(200).json({
            success: true,
            category,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to get category",
            error: error.message,
        });
    }
};


// ===============================
// Update Category
// ===============================
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const image = req.file ? req.file.path : null;
        const { name, slug, description, isActive } = req.body;

        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        category.name = name ?? category.name;
        category.slug = slug ?? category.slug;
        category.description = description ?? category.description;
        category.image = image ?? category.image;
        category.isActive = isActive ?? category.isActive;

        await category.save();

        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update category",
            error: error.message,
        });
    }
};


// ===============================
// Delete Category
// ===============================
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        await Category.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete category",
            error: error.message,
        });
    }
};


module.exports = {
    createCategory,
    getAllCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory,
};
