const Product = require("../models/productsModel");

const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            discountPrice,
            stock,
            category
        } = req.body;
        const productImage = req.file.path;
        const existingProduct = await Product.findOne({ name });
        if (existingProduct) {
            return res.status(400).json({
                message: "Product with this name already exists"
            });
        }
        const product = await Product.create({
            name,
            description,
            price,
            discountPrice,
            stock,
            productImage,
            category
        });

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("category");
        res.status(200).json({
            success: true,
            products,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("category");
        res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};