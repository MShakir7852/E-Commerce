const Order = require("../models/orderModel");


const createOrder = async (orderData) => {
   
    const order = await Order.create(orderData);

    return order;
};


const getUserOrders = async (userId) => {
    const orders = await Order.find({
        user: userId,
    })
        .populate("items.product")
        .sort({ createdAt: -1 });

    return orders;
};


const getOrderById = async (orderId, userId) => {
    const order = await Order.findOne({
        _id: orderId,
        user: userId,
    }).populate("items.product");

    return order;
};

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
    getOrderById,
    getOrderByTrackingNumber,
};