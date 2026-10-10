const orderService = require("../services/orderService");

const createOrder = async (req, res) => {
    try {
        const trackingNumber =
            "SZT-" +
            Math.random()
                .toString(36)
                .substring(2, 10)
                .toUpperCase();

        const orderData = {
            user: req.user._id || req.user,
            items: req.body.items,
            shippingAddress: req.body.shippingAddress,
            paymentMethod: req.body.paymentMethod,
            subtotal: req.body.subtotal,
            shippingFee: req.body.shippingFee,
            total: req.body.total,
            trackingNumber,
        };

        const order = await orderService.createOrder(orderData);

        return res.status(201).json({
            statusText: "success",
            message: "Order placed successfully",
            order,
        });
    } catch (error) {
        console.error("CREATE ORDER ERROR:", error);

        return res.status(500).json({
            statusText: "error",
            message: error.message || "Failed to create order",
        });
    }
};

// Get logged-in user's orders
const getUserOrders = async (req, res) => {
    try {
        const userId = req.user._id || req.user;

        const orders = await orderService.getUserOrders(userId);

        return res.status(200).json({
            statusText: "success",
            orders,
        });
    } catch (error) {
        console.error("Get User Orders Error:", error);

        return res.status(500).json({
            statusText: "error",
            message: "Failed to get orders",
            error: error.message,
        });
    }
};

// Get all orders (Admin)
const getAllOrders = async (req, res) => {
    try {
        const orders = await orderService.getAllOrders();

        return res.status(200).json({
            statusText: "success",
            message: "All orders fetched successfully",
            totalOrders: orders.length,
            orders,
        });
    } catch (error) {
        console.error("Get All Orders Error:", error);

        return res.status(500).json({
            statusText: "error",
            message: "Failed to get all orders",
            error: error.message,
        });
    }
};

// Get single order by ID
const getOrderById = async (req, res) => {
    try {
        const userId = req.user._id || req.user;

        const order = await orderService.getOrderById(
            req.params.id,
            userId
        );

        if (!order) {
            return res.status(404).json({
                statusText: "error",
                message: "Order not found",
            });
        }

        return res.status(200).json({
            statusText: "success",
            order,
        });
    } catch (error) {
        console.error("Get Order Error:", error);

        return res.status(500).json({
            statusText: "error",
            message: "Failed to get order",
            error: error.message,
        });
    }
};

// Get order by tracking number
const getOrderByTrackingNumber = async (req, res) => {
    try {
        const userId = req.user._id || req.user;
        const trackingNumber = req.params.trackingNumber;

        const order =
            await orderService.getOrderByTrackingNumber(
                trackingNumber,
                userId
            );

        if (!order) {
            return res.status(404).json({
                statusText: "error",
                message: "Order not found",
            });
        }

        return res.status(200).json({
            statusText: "success",
            order,
        });
    } catch (error) {
        console.error("Track Order Error:", error);

        return res.status(500).json({
            statusText: "error",
            message: "Failed to track order",
            error: error.message,
        });
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    getAllOrders,
    getOrderById,
    getOrderByTrackingNumber,
};