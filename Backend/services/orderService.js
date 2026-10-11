
const Order = require("../models/orderModel");

const sendOrderConfirmationEmail = require("../utills/emailService.js");

const createOrder = async (orderData) => {
    const order = await Order.create(orderData);

    try {
        await sendOrderConfirmationEmail({
            customerEmail: orderData.user?.email,
            customerName: orderData.shippingAddress.fullName,
            order,
        });
    } catch (emailError) {
        console.error("ORDER EMAIL ERROR:", emailError.message);
    }

    return order;
};

// Get logged-in user's orders
const getUserOrders = async (userId) => {
    return await Order.find({ user: userId })
        .populate("items.product")
        .sort({ createdAt: -1 });
};

// Get all orders (Admin)
const getAllOrders = async () => {
    return await Order.find()
        .populate("items.product")
        .populate("user", "firstName lastName email")
        .sort({ createdAt: -1 });
};

// Get single order by ID for a specific user
const getOrderById = async (orderId, userId) => {
    return await Order.findOne({
        _id: orderId,
        user: userId,
    }).populate("items.product");
};

// Get order by tracking number
const getOrderByTrackingNumber = async (trackingNumber, userId) => {
    return await Order.findOne({
        trackingNumber: trackingNumber.toUpperCase(),
        user: userId,
    }).populate("items.product");
};

// Update order (Admin)
const updateOrder = async (orderId, updateData) => {
    const allowedStatuses = [
        "Pending",
        "Confirmed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
    ];

    if (
        updateData.status &&
        !allowedStatuses.includes(updateData.status)
    ) {
        throw new Error("Invalid order status");
    }

    const order = await Order.findByIdAndUpdate(
        orderId,
        { $set: updateData },
        {
            new: true,
            runValidators: true,
        }
    )
        .populate("items.product")
        .populate("user", "firstName lastName email");

    if (!order) {
        throw new Error("Order not found");
    }

    return order;
};

module.exports = {
    createOrder,
    getUserOrders,
    getAllOrders,
    getOrderById,
    getOrderByTrackingNumber,
    updateOrder,
};
