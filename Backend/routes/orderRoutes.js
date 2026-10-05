const express = require("express");

const router = express.Router();

const {
    createOrder,
    getUserOrders,
    getOrderById,
} = require("../controllers/orderController");

const  {isAuthenticated}  = require("../midllware/isAuthenticated");

router.post("/create", isAuthenticated, createOrder);

router.get("/", isAuthenticated, getUserOrders);

router.get("/:id", isAuthenticated, getOrderById);

module.exports = router;