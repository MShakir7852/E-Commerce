import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    Check,
    Package,
    Truck,
    ShoppingBag,
    Sparkles,
    ArrowRight,
} from "lucide-react";

const OrderSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const order = location.state?.order;

    const [show, setShow] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    // If user directly opens /order-success without order data
    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
                <div className="text-center">
                    <Package
                        size={55}
                        className="mx-auto mb-4 text-gray-400"
                    />

                    <h2 className="text-2xl font-bold text-white mb-2">
                        No Order Found
                    </h2>

                    <p className="text-gray-400 mb-6">
                        We couldn't find your order details.
                    </p>

                    <button
                        onClick={() => navigate("/")}
                        className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center px-4 py-10">

            {/* Background Glow */}
            <div className="absolute w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl -top-20 -left-20" />

            <div className="absolute w-80 h-80 bg-blue-500/20 rounded-full blur-3xl -bottom-20 -right-20" />

            {/* Floating Sparkles */}
            <Sparkles
                className="absolute top-[18%] left-[18%] text-white/30 animate-pulse"
                size={22}
            />

            <Sparkles
                className="absolute top-[25%] right-[20%] text-emerald-300/40 animate-pulse"
                size={18}
            />

            <Sparkles
                className="absolute bottom-[20%] left-[25%] text-blue-300/30 animate-pulse"
                size={20}
            />

            {/* Glass Popup */}
            <div
                className={`
                    relative z-10
                    w-full max-w-lg
                    rounded-3xl
                    border border-white/20
                    bg-white/10
                    backdrop-blur-2xl
                    shadow-[0_25px_80px_rgba(0,0,0,0.45)]
                    p-6 sm:p-8
                    text-center
                    transition-all duration-700 ease-out
                    ${
                        show
                            ? "opacity-100 scale-100 translate-y-0"
                            : "opacity-0 scale-90 translate-y-8"
                    }
                `}
            >

                {/* Success Icon */}
                <div className="relative flex justify-center mb-6">

                    {/* Outer Ring */}
                    <div
                        className="
                            absolute
                            w-28 h-28
                            rounded-full
                            border border-emerald-400/20
                            animate-ping
                        "
                    />

                    {/* Glow */}
                    <div
                        className="
                            absolute
                            w-24 h-24
                            rounded-full
                            bg-emerald-400/20
                            blur-xl
                        "
                    />

                    {/* Circle */}
                    <div
                        className="
                            relative
                            w-24 h-24
                            rounded-full
                            bg-gradient-to-br
                            from-emerald-400
                            to-green-600
                            flex items-center justify-center
                            shadow-[0_0_40px_rgba(34,197,94,0.45)]
                        "
                    >
                        <Check
                            size={48}
                            strokeWidth={3}
                            className="text-white animate-[scaleIn_0.5s_ease-out]"
                        />
                    </div>
                </div>

                {/* Heading */}
                <div className="mb-6">

                    <p className="text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-2">
                        Order Confirmed
                    </p>

                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
                        Order Placed Successfully!
                    </h1>

                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                        Thank you for shopping with{" "}
                        <span className="text-white font-semibold">
                            ShopZone
                        </span>
                        . Your order has been received and is being prepared.
                    </p>
                </div>

                {/* Order Info */}
                <div
                    className="
                        rounded-2xl
                        border border-white/10
                        bg-black/20
                        backdrop-blur-xl
                        p-4
                        mb-6
                        text-left
                    "
                >

                    {/* Tracking */}
                    <div className="flex items-center justify-between gap-4 mb-4">

                        <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                <Truck
                                    size={19}
                                    className="text-blue-400"
                                />
                            </div>

                            <div>
                                <p className="text-xs text-gray-400">
                                    Tracking Number
                                </p>

                                <p className="text-sm font-bold text-white tracking-wide">
                                    {order.trackingNumber || "Processing..."}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-white/10 mb-4" />

                    {/* Total */}
                    <div className="flex items-center justify-between">

                        <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                <Package
                                    size={19}
                                    className="text-purple-400"
                                />
                            </div>

                            <div>
                                <p className="text-xs text-gray-400">
                                    Order Total
                                </p>

                                <p className="text-lg font-bold text-white">
                                    Rs.{" "}
                                    {Number(order.total || 0).toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <span className="
                            px-3 py-1.5
                            rounded-full
                            bg-emerald-400/10
                            border border-emerald-400/20
                            text-emerald-400
                            text-xs
                            font-semibold
                        ">
                            Confirmed
                        </span>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">

                    {/* Track Order */}
                    <button
                        onClick={() =>
                            navigate(
                                `/track-order/${order.trackingNumber}`
                            )
                        }
                        className="
                            group
                            flex-1
                            flex items-center justify-center gap-2
                            px-5 py-3.5
                            rounded-xl
                            bg-white
                            text-gray-900
                            font-bold
                            hover:bg-gray-100
                            transition-all
                            duration-300
                            shadow-lg
                        "
                    >
                        <Truck size={18} />

                        Track Order

                        <ArrowRight
                            size={17}
                            className="
                                group-hover:translate-x-1
                                transition-transform
                            "
                        />
                    </button>

                    {/* Continue Shopping */}
                    <Link
                        to="/Products"
                        className="
                            flex-1
                            flex items-center justify-center gap-2
                            px-5 py-3.5
                            rounded-xl
                            bg-white/10
                            border border-white/20
                            text-white
                            font-semibold
                            hover:bg-white/20
                            transition-all
                            duration-300
                        "
                    >
                        <ShoppingBag size={18} />

                        Continue Shopping
                    </Link>
                </div>

                {/* Footer */}
                <p className="mt-6 text-xs text-gray-400">
                    A confirmation has been sent to your registered email.
                </p>
            </div>

            {/* Custom Animation */}
            <style>
                {`
                    @keyframes scaleIn {
                        0% {
                            transform: scale(0);
                            opacity: 0;
                        }

                        70% {
                            transform: scale(1.15);
                        }

                        100% {
                            transform: scale(1);
                            opacity: 1;
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default OrderSuccess;
