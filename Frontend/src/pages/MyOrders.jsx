import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    Package,
    Truck,
    Clock,
    CheckCircle,
    XCircle,
    Eye,
    ShoppingBag,
} from "lucide-react";

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const { accessToken } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);

                const response = await axios.get(
                    "http://localhost:3000/api/orders",
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                        withCredentials: true,
                    }
                );

                if (response.data.statusText === "success") {
                    setOrders(response.data.orders || []);
                }
            } catch (error) {
                console.error(
                    "GET ORDERS ERROR:",
                    error.response?.data || error.message
                );
            } finally {
                setLoading(false);
            }
        };

        if (accessToken) {
            fetchOrders();
        }
    }, [accessToken]);

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case "delivered":
                return <CheckCircle size={16} />;

            case "cancelled":
            case "canceled":
                return <XCircle size={16} />;

            case "shipped":
                return <Truck size={16} />;

            default:
                return <Clock size={16} />;
        }
    };

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case "delivered":
                return "bg-green-50 text-green-600 border-green-200";

            case "cancelled":
            case "canceled":
                return "bg-red-50 text-red-600 border-red-200";

            case "shipped":
                return "bg-blue-50 text-blue-600 border-blue-200";

            default:
                return "bg-yellow-50 text-yellow-600 border-yellow-200";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 px-4 py-10">
                <div className="max-w-6xl mx-auto">
                    <div className="animate-pulse space-y-5">
                        <div className="h-10 bg-gray-200 rounded-xl w-48"></div>

                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="h-40 bg-gray-200 rounded-2xl"
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center">
                            <ShoppingBag
                                size={22}
                                className="text-white"
                            />
                        </div>

                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                My Orders
                            </h1>

                            <p className="text-sm text-gray-500">
                                View and track all your orders
                            </p>
                        </div>
                    </div>
                </div>

                {/* No Orders */}
                {orders.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center shadow-sm">

                        <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gray-100 flex items-center justify-center">
                            <Package
                                size={35}
                                className="text-gray-400"
                            />
                        </div>

                        <h2 className="text-xl font-bold text-gray-800 mb-2">
                            No Orders Yet
                        </h2>

                        <p className="text-gray-500 mb-6">
                            You haven't placed any orders yet.
                        </p>

                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                        >
                            <ShoppingBag size={18} />
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-5">

                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden"
                            >

                                {/* Order Header */}
                                <div className="p-5 border-b border-gray-100">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wider">
                                                Order ID
                                            </p>

                                            <p className="font-semibold text-gray-800">
                                                #{order._id.slice(-8).toUpperCase()}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wider">
                                                Tracking Number
                                            </p>

                                            <p className="font-semibold text-blue-600">
                                                {order.trackingNumber || "N/A"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wider">
                                                Date
                                            </p>

                                            <p className="text-sm font-medium text-gray-700">
                                                {new Date(
                                                    order.createdAt
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>

                                        <div
                                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${getStatusStyle(
                                                order.status
                                            )}`}
                                        >
                                            {getStatusIcon(order.status)}

                                            {order.status || "Pending"}
                                        </div>

                                    </div>
                                </div>

                                {/* Products */}
                                <div className="p-5">

                                    <div className="space-y-4">

                                        {order.items?.map((item, index) => (
                                            <div
                                                key={item._id || index}
                                                className="flex items-center gap-4"
                                            >

                                                {/* Product Image */}
                                                <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                                                    {item.product?.productImage ? (
                                                        <img
                                                            src={
                                                                item.product
                                                                    .productImage
                                                            }
                                                            alt={
                                                                item.product
                                                                    ?.name ||
                                                                item.name
                                                            }
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Package
                                                                size={24}
                                                                className="text-gray-400"
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Product Info */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-gray-800 truncate">
                                                        {item.product?.name ||
                                                            item.name ||
                                                            "Product"}
                                                    </h3>

                                                    <p className="text-sm text-gray-500">
                                                        Quantity:{" "}
                                                        {item.quantity}
                                                    </p>
                                                </div>

                                                {/* Price */}
                                                <div className="text-right">
                                                    <p className="font-semibold text-gray-800">
                                                        Rs.{" "}
                                                        {Number(
                                                            item.price || 0
                                                        ).toLocaleString()}
                                                    </p>
                                                </div>

                                            </div>
                                        ))}

                                    </div>

                                    {/* Footer */}
                                    <div className="mt-5 pt-5 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Total Amount
                                            </p>

                                            <p className="text-xl font-bold text-gray-900">
                                                Rs.{" "}
                                                {Number(
                                                    order.total || 0
                                                ).toLocaleString()}
                                            </p>
                                        </div>

                                        <div className="flex gap-3">

                                            <Link
                                                to={`/track-order/${order.trackingNumber}`}
                                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition"
                                            >
                                                <Truck size={17} />
                                                Track Order
                                            </Link>

                                            <Link
                                                to={`/orders/${order._id}`}
                                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition"
                                            >
                                                <Eye size={17} />
                                                View Details
                                            </Link>

                                        </div>

                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;