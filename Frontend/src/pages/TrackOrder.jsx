import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import {
    Search,
    Package,
    CheckCircle2,
    Clock3,
    Truck,
    MapPin,
    ShoppingBag,
    CreditCard,
    CalendarDays,
    ArrowRight,
    ShieldCheck,
    Box,
    Loader2,
    AlertCircle,
    Sparkles,
} from "lucide-react";

const STATUS_STEPS = [
    {
        key: "Pending",
        title: "Order Placed",
        description: "We've received your order.",
        icon: ShoppingBag,
    },
    {
        key: "Confirmed",
        title: "Order Confirmed",
        description: "Your order has been confirmed.",
        icon: CheckCircle2,
    },
    {
        key: "Processing",
        title: "Processing",
        description: "Your order is being prepared.",
        icon: Box,
    },
    {
        key: "Shipped",
        title: "Shipped",
        description: "Your package is on its way.",
        icon: Truck,
    },
    {
        key: "Delivered",
        title: "Delivered",
        description: "Your package has been delivered.",
        icon: Package,
    },
];

const TrackOrder = () => {
    const [trackingNumber, setTrackingNumber] = useState("");
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);

    const { accessToken } = useSelector(
        (state) => state.auth
    );

    const handleTrackOrder = async (e) => {
        e.preventDefault();

        

        if (!trackingNumber) {
            toast.error("Please enter your tracking number");
            return;
        }

        if (!accessToken) {
            toast.error("Please login to track your order");
            return;
        }

        try {
            setLoading(true);
            setOrder(null);

            const response = await axios.get(
                `http://localhost:3000/api/orders/track/${trackingNumber}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    withCredentials: true,
                }
            );

            if (response.data?.statusText === "success") {
                setOrder(response.data.order);
                toast.success("Order found successfully");
            }
        } catch (error) {
            console.error(
                "Track Order Error:",
                error.response?.data || error.message
            );

            setOrder(null);

            toast.error(
                error.response?.data?.message ||
                    "Order not found"
            );
        } finally {
            setLoading(false);
        }
    };

    const getStatusIndex = () => {
        if (!order?.status) return -1;

        return STATUS_STEPS.findIndex(
            (step) => step.key === order.status
        );
    };

    const currentStatusIndex = getStatusIndex();

    const formatDate = (date) => {
        if (!date) return "—";

        return new Date(date).toLocaleDateString(
            "en-US",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
            }
        );
    };

    const formatTime = (date) => {
        if (!date) return "";

        return new Date(date).toLocaleTimeString(
            "en-US",
            {
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">

            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
                <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />
                <div className="absolute -bottom-40 left-1/3 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">

                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-10">

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl text-sm text-blue-300 mb-5">
                        <Sparkles size={15} />
                        Real-time Order Tracking
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
                        Track Your
                        <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                            Order
                        </span>
                    </h1>

                    <p className="text-slate-400 mt-4 text-sm sm:text-base">
                        Enter your tracking number to see the latest
                        status and delivery progress.
                    </p>
                </div>

                {/* Search Card */}
                <div className="max-w-3xl mx-auto mb-10">

                    <form
                        onSubmit={handleTrackOrder}
                        className="relative p-2 rounded-2xl bg-white/[0.07] border border-white/10 backdrop-blur-2xl shadow-2xl"
                    >

                        <div className="flex flex-col sm:flex-row gap-2">

                            <div className="relative flex-1">

                                <Search
                                    size={20}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                                />

                                <input
                                    type="text"
                                    value={trackingNumber}
                                    onChange={(e) =>
                                        setTrackingNumber(
                                            e.target.value.toUpperCase()
                                        )
                                    }
                                    placeholder="Enter tracking number e.g. SZT-ABC12345"
                                    className="w-full h-14 pl-12 pr-4 rounded-xl bg-black/20 border border-white/10 outline-none text-white placeholder:text-slate-600 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10 transition"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="h-14 px-7 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all disabled:opacity-60"
                            >
                                {loading ? (
                                    <>
                                        <Loader2
                                            size={19}
                                            className="animate-spin"
                                        />
                                        Tracking...
                                    </>
                                ) : (
                                    <>
                                        Track Order
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>

                        </div>
                    </form>
                </div>

                {/* Empty State */}
                {!order && !loading && (
                    <div className="max-w-3xl mx-auto">

                        <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-10 sm:p-14 text-center">

                            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center mb-6">
                                <Package
                                    size={38}
                                    className="text-blue-400"
                                />
                            </div>

                            <h2 className="text-xl sm:text-2xl font-bold">
                                Ready to track your order?
                            </h2>

                            <p className="text-slate-500 mt-2 text-sm">
                                Enter the tracking number above to
                                view your order journey.
                            </p>

                        </div>
                    </div>
                )}

                {/* Order Result */}
                {order && (
                    <div className="space-y-6">

                        {/* Order Summary */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* Tracking Card */}
                            <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-2xl p-6 sm:p-8 shadow-2xl">

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">

                                    <div>
                                        <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                                            <Package size={16} />
                                            Tracking Number
                                        </div>

                                        <div className="text-2xl sm:text-3xl font-black tracking-wide text-white">
                                            {order.trackingNumber}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-semibold">
                                        <Truck size={16} />
                                        {order.status}
                                    </div>

                                </div>

                                <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-5">

                                    <div>
                                        <p className="text-xs text-slate-500">
                                            Order Date
                                        </p>
                                        <div className="flex items-center gap-2 mt-1 text-sm font-semibold">
                                            <CalendarDays size={15} className="text-blue-400" />
                                            {formatDate(order.createdAt)}
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-500">
                                            Payment
                                        </p>
                                        <div className="flex items-center gap-2 mt-1 text-sm font-semibold">
                                            <CreditCard size={15} className="text-purple-400" />
                                            {order.paymentMethod}
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-500">
                                            Total
                                        </p>
                                        <div className="mt-1 text-lg font-black">
                                            Rs. {Number(order.total).toLocaleString()}
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Delivery Address */}
                            <div className="rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-2xl p-6 shadow-2xl">

                                <div className="flex items-center gap-2 mb-5">
                                    <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                        <MapPin
                                            size={18}
                                            className="text-purple-400"
                                        />
                                    </div>

                                    <div>
                                        <h3 className="font-bold">
                                            Delivery Address
                                        </h3>

                                        <p className="text-xs text-slate-500">
                                            Shipping destination
                                        </p>
                                    </div>
                                </div>

                                <div className="text-sm space-y-1">
                                    <p className="font-semibold">
                                        {order.shippingAddress?.fullName}
                                    </p>

                                    <p className="text-slate-400">
                                        {order.shippingAddress?.address}
                                    </p>

                                    <p className="text-slate-400">
                                        {order.shippingAddress?.city},{" "}
                                        {order.shippingAddress?.postalCode}
                                    </p>

                                    <p className="text-slate-400">
                                        {order.shippingAddress?.phone}
                                    </p>
                                </div>

                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-2xl p-6 sm:p-10 shadow-2xl">

                            <div className="mb-10">
                                <div className="flex items-center gap-3">

                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
                                        <Truck
                                            size={21}
                                            className="text-blue-400"
                                        />
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-bold">
                                            Delivery Progress
                                        </h2>

                                        <p className="text-sm text-slate-500">
                                            Follow your order every step of the way
                                        </p>
                                    </div>

                                </div>
                            </div>

                            <div className="relative">

                                {STATUS_STEPS.map((step, index) => {

                                    const Icon = step.icon;

                                    const completed =
                                        index <= currentStatusIndex;

                                    const current =
                                        index === currentStatusIndex;

                                    const isLast =
                                        index === STATUS_STEPS.length - 1;

                                    return (
                                        <div
                                            key={step.key}
                                            className="relative flex gap-5 sm:gap-7 pb-10 last:pb-0"
                                        >

                                            {/* Connector */}
                                            {!isLast && (
                                                <div
                                                    className={`absolute left-[22px] top-12 w-[2px] h-[calc(100%-8px)] ${
                                                        index < currentStatusIndex
                                                            ? "bg-gradient-to-b from-blue-500 to-purple-500"
                                                            : "bg-white/10"
                                                    }`}
                                                />
                                            )}

                                            {/* Icon */}
                                            <div
                                                className={`relative z-10 shrink-0 w-11 h-11 rounded-full flex items-center justify-center border transition-all ${
                                                    completed
                                                        ? "bg-gradient-to-br from-blue-500 to-purple-600 border-blue-400/50 text-white shadow-lg shadow-blue-500/20"
                                                        : "bg-white/5 border-white/10 text-slate-600"
                                                } ${
                                                    current
                                                        ? "ring-4 ring-blue-500/10 scale-105"
                                                        : ""
                                                }`}
                                            >
                                                <Icon size={19} />
                                            </div>

                                            {/* Content */}
                                            <div className="pt-1 flex-1">

                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">

                                                    <div>
                                                        <h3
                                                            className={`font-bold ${
                                                                completed
                                                                    ? "text-white"
                                                                    : "text-slate-600"
                                                            }`}
                                                        >
                                                            {step.title}
                                                        </h3>

                                                        <p
                                                            className={`text-sm mt-1 ${
                                                                completed
                                                                    ? "text-slate-400"
                                                                    : "text-slate-700"
                                                            }`}
                                                        >
                                                            {step.description}
                                                        </p>
                                                    </div>

                                                    {current && (
                                                        <span className="w-fit inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                                                            Current
                                                        </span>
                                                    )}

                                                </div>

                                                {completed && index === 0 && (
                                                    <p className="text-xs text-slate-600 mt-2">
                                                        {formatDate(order.createdAt)}{" "}
                                                        {formatTime(order.createdAt)}
                                                    </p>
                                                )}

                                            </div>

                                        </div>
                                    );
                                })}

                            </div>
                        </div>

                        {/* Products */}
                        <div className="rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-2xl p-6 sm:p-8 shadow-2xl">

                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-bold">
                                        Order Items
                                    </h2>

                                    <p className="text-sm text-slate-500">
                                        {order.items?.length || 0} product(s)
                                    </p>
                                </div>

                                <ShieldCheck
                                    size={22}
                                    className="text-emerald-400"
                                />
                            </div>

                            <div className="space-y-3">

                                {order.items?.map((item, index) => (
                                    <div
                                        key={item._id || index}
                                        className="flex items-center gap-4 p-4 rounded-2xl bg-black/20 border border-white/5"
                                    >

                                        <div className="w-16 h-16 rounded-xl bg-white/5 overflow-hidden shrink-0">

                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Package
                                                        size={22}
                                                        className="text-slate-600"
                                                    />
                                                </div>
                                            )}

                                        </div>

                                        <div className="flex-1 min-w-0">

                                            <h3 className="font-semibold truncate">
                                                {item.name}
                                            </h3>

                                            <p className="text-sm text-slate-500 mt-1">
                                                Qty: {item.quantity}
                                            </p>

                                        </div>

                                        <div className="text-right">
                                            <p className="font-bold">
                                                Rs.{" "}
                                                {(
                                                    Number(item.price) *
                                                    Number(item.quantity)
                                                ).toLocaleString()}
                                            </p>

                                            <p className="text-xs text-slate-600">
                                                Rs. {Number(item.price).toLocaleString()} each
                                            </p>
                                        </div>

                                    </div>
                                ))}

                            </div>
                        </div>

                    </div>
                )}

                {/* Security Footer */}
                <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-600">
                    <ShieldCheck size={14} />
                    Your order information is securely protected
                </div>

            </div>
        </div>
    );
};

export default TrackOrder;