const express = require("express");
const router = express.Router();

const {
    createOrder,
    getUserOrders,
    getAllOrders,
    getOrderById,
    getOrderByTrackingNumber,
} = require("../controllers/orderController");

const { isAuthenticated,isAdmin } = require("../midllware/isAuthenticated");

// Create new order
router.post("/create", isAuthenticated, createOrder);

// Get all orders (Admin) — must be before /:id
router.get("/all", isAuthenticated, isAdmin, getAllOrders);

// Get logged-in user's orders
router.get("/", isAuthenticated, getUserOrders);

// Track order by tracking number — must be before /:id
router.get(
    "/track/:trackingNumber",
    isAuthenticated,
    getOrderByTrackingNumber
);

// Get a single order by ID
router.get("/:id", isAuthenticated, getOrderById);

module.exports = router;