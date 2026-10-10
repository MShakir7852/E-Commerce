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
    const orders = await Order.find({
        user: userId,
    })
        .populate("items.product")
        .sort({ createdAt: -1 });

    return orders;
};

// Get all orders (Admin)
const getAllOrders = async () => {
    const orders = await Order.find()
        .populate("items.product")
        .populate("user", "firstName lastName email")
        .sort({ createdAt: -1 });

    return orders;
};

// Get single order by ID for a specific user
const getOrderById = async (orderId, userId) => {
    const order = await Order.findOne({
        _id: orderId,
        user: userId,
    }).populate("items.product");

    return order;
};

// Get order by tracking number
const getOrderByTrackingNumber = async (trackingNumber, userId) => {
    const order = await Order.findOne({
        trackingNumber: trackingNumber.toUpperCase(),
        user: userId,
    });

    return order;
};

module.exports = {
    createOrder,
    getUserOrders,
    getAllOrders,
    getOrderById,
    getOrderByTrackingNumber,
};