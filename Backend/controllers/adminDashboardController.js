// import Order from "../models/orderModel.js";
const Order=require("../models/orderModel.js")
const Product=require("../models/productsModel.js")
const User=require("../models/userModel.js")
// import Product from "../models/productsModel.js";
// import User from "../models/userModel.js";

const getAdminDashboard = async (req, res) => {
    try {
        // =====================================================
        // BASIC COUNTS
        // =====================================================

        const [
            totalOrders,
            totalProducts,
            totalCustomers,
            revenueResult,
        ] = await Promise.all([
            Order.countDocuments(),

            Product.countDocuments(),

            User.countDocuments({
                role: { $ne: "admin" },
            }),

            Order.aggregate([
                {
                    $match: {
                        status: { $ne: "Cancelled" },
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalRevenue: {
                            $sum: "$total",
                        },
                    },
                },
            ]),
        ]);

        const totalRevenue =
            revenueResult.length > 0
                ? revenueResult[0].totalRevenue
                : 0;

        // =====================================================
        // RECENT ORDERS
        // =====================================================

        const recentOrders = await Order.find()
            .populate(
                "user",
                "firstName lastName email"
            )
            .populate(
                "items.product",
                "name productImage"
            )
            .sort({
                createdAt: -1,
            })
            .limit(5)
            .lean();

        // =====================================================
        // TOP PRODUCTS
        // =====================================================

        const topProducts = await Order.aggregate([
            {
                $match: {
                    status: {
                        $ne: "Cancelled",
                    },
                },
            },

            {
                $unwind: "$items",
            },

            {
                $group: {
                    _id: "$items.product",

                    sold: {
                        $sum: "$items.quantity",
                    },

                    revenue: {
                        $sum: {
                            $multiply: [
                                "$items.quantity",
                                "$items.price",
                            ],
                        },
                    },
                },
            },

            {
                $sort: {
                    sold: -1,
                },
            },

            {
                $limit: 4,
            },

            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product",
                },
            },

            {
                $unwind: {
                    path: "$product",
                    preserveNullAndEmptyArrays: true,
                },
            },

            {
                $project: {
                    _id: 1,
                    sold: 1,
                    revenue: 1,

                    name: "$product.name",

                    category: "$product.category",

                    image: "$product.productImage",
                },
            },
        ]);

        // =====================================================
        // ORDER STATUS SUMMARY
        // =====================================================

        const orderSummary = await Order.aggregate([
            {
                $group: {
                    _id: "$status",

                    count: {
                        $sum: 1,
                    },
                },
            },
        ]);

        // =====================================================
        // LAST 7 DAYS REVENUE
        // =====================================================

        const sevenDaysAgo = new Date();

        sevenDaysAgo.setDate(
            sevenDaysAgo.getDate() - 6
        );

        sevenDaysAgo.setHours(0, 0, 0, 0);

        const revenueChart = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: sevenDaysAgo,
                    },

                    status: {
                        $ne: "Cancelled",
                    },
                },
            },

            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt",
                        },
                    },

                    revenue: {
                        $sum: "$total",
                    },

                    orders: {
                        $sum: 1,
                    },
                },
            },

            {
                $sort: {
                    _id: 1,
                },
            },
        ]);

        // =====================================================
        // LOW STOCK
        // =====================================================

        const lowStockProducts = await Product.find({
            stock: {
                $lte: 10,
            },
        })
            .select("name stock productImage")
            .sort({
                stock: 1,
            })
            .limit(10)
            .lean();

        // =====================================================
        // RESPONSE
        // =====================================================

        return res.status(200).json({
            statusText: "success",

            data: {
                stats: {
                    totalRevenue,
                    totalOrders,
                    totalProducts,
                    totalCustomers,
                },

                recentOrders,

                topProducts,

                orderSummary,

                revenueChart,

                lowStockProducts,
            },
        });
    } catch (error) {
        console.error(
            "Admin Dashboard Error:",
            error
        );

        return res.status(500).json({
            statusText: "error",
            message: "Failed to load admin dashboard",
            error: error.message,
        });
    }
};

module.exports= getAdminDashboard;