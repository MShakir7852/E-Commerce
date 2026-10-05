import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    X,
    ShoppingBag,
    Plus,
    Minus,
    Trash2,
    ArrowRight,
    ShieldCheck,
} from "lucide-react";

import {
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
} from "../redux/slices/cartSlice";

const AddToCart = ({ isOpen, onClose }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cartItems = useSelector(
        (state) => state.cart.items
    );

    const totalQuantity = useSelector(
        (state) => state.cart.totalQuantity
    );

    const totalPrice = useSelector(
        (state) => state.cart.totalPrice
    );

    const getItemPrice = (item) => {
        const discountPrice = Number(item.discountPrice);
        const price = Number(item.price);

        return discountPrice > 0
            ? discountPrice
            : price;
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[9999]"
            onClick={onClose}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            {/* Drawer */}
            <div
                onClick={(e) => e.stopPropagation()}
                className="
                    absolute right-0 top-0
                    h-full w-full sm:w-[450px]
                    bg-white
                    shadow-2xl
                    flex flex-col
                    animate-in slide-in-from-right duration-300
                "
            >

                {/* ================= HEADER ================= */}

                <div className="px-6 py-5 border-b border-gray-100 bg-white">

                    <div className="flex items-center justify-between">

                        <div className="flex items-center gap-3">

                            <div className="
                                w-11 h-11
                                rounded-2xl
                                bg-blue-50
                                text-blue-600
                                flex items-center justify-center
                            ">
                                <ShoppingBag size={22} />
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    Your Cart
                                </h2>

                                <p className="text-sm text-gray-500">
                                    {totalQuantity}{" "}
                                    {totalQuantity === 1
                                        ? "item"
                                        : "items"}
                                </p>
                            </div>

                        </div>

                        <button
                            onClick={onClose}
                            className="
                                w-10 h-10
                                rounded-full
                                bg-gray-100
                                flex items-center justify-center
                                text-gray-500
                                hover:bg-red-50
                                hover:text-red-500
                                transition
                            "
                        >
                            <X size={20} />
                        </button>

                    </div>

                </div>

                {/* ================= PRODUCTS ================= */}

                <div className="flex-1 overflow-y-auto px-5 py-5">

                    {cartItems.length === 0 ? (

                        <div className="
                            h-full
                            flex flex-col
                            items-center justify-center
                            text-center
                        ">

                            <div className="
                                w-24 h-24
                                rounded-full
                                bg-gray-100
                                flex items-center justify-center
                                mb-5
                            ">
                                <ShoppingBag
                                    size={38}
                                    className="text-gray-400"
                                />
                            </div>

                            <h3 className="
                                text-xl
                                font-bold
                                text-gray-900
                            ">
                                Your cart is empty
                            </h3>

                            <p className="
                                text-sm
                                text-gray-500
                                mt-2
                                max-w-[250px]
                            ">
                                Looks like you haven't added
                                anything to your cart yet.
                            </p>

                            <button
                                onClick={onClose}
                                className="
                                    mt-6
                                    px-6 py-3
                                    rounded-xl
                                    bg-gray-900
                                    text-white
                                    font-semibold
                                    hover:bg-blue-600
                                    transition
                                "
                            >
                                Start Shopping
                            </button>

                        </div>

                    ) : (

                        <div className="space-y-4">

                            {cartItems.map((item) => {

                                const itemPrice =
                                    getItemPrice(item);

                                const itemTotal =
                                    itemPrice *
                                    item.quantity;

                                const originalPrice =
                                    Number(item.price);

                                const hasDiscount =
                                    Number(item.discountPrice) > 0 &&
                                    Number(item.discountPrice) <
                                        originalPrice;

                                return (
                                    <div
                                        key={item._id}
                                        className="
                                            group
                                            relative
                                            flex gap-4
                                            p-4
                                            rounded-2xl
                                            border border-gray-100
                                            bg-gray-50
                                            hover:bg-white
                                            hover:shadow-lg
                                            transition-all duration-300
                                        "
                                    >

                                        {/* Product Image */}

                                        <div className="
                                            w-24 h-24
                                            flex-shrink-0
                                            rounded-xl
                                            overflow-hidden
                                            bg-white
                                            border border-gray-100
                                        ">
                                            <img
                                                src={item.productImage}
                                                alt={item.name}
                                                className="
                                                    w-full h-full
                                                    object-cover
                                                    group-hover:scale-105
                                                    transition-transform
                                                    duration-300
                                                "
                                            />
                                        </div>

                                        {/* Product Details */}

                                        <div className="flex-1 min-w-0">

                                            <div className="
                                                flex
                                                justify-between
                                                gap-2
                                            ">

                                                <h3 className="
                                                    font-semibold
                                                    text-gray-900
                                                    line-clamp-2
                                                    leading-5
                                                ">
                                                    {item.name}
                                                </h3>

                                                <button
                                                    onClick={() =>
                                                        dispatch(
                                                            removeFromCart(
                                                                item._id
                                                            )
                                                        )
                                                    }
                                                    className="
                                                        flex-shrink-0
                                                        text-gray-400
                                                        hover:text-red-500
                                                        transition
                                                    "
                                                >
                                                    <Trash2
                                                        size={17}
                                                    />
                                                </button>

                                            </div>

                                            {/* Price */}

                                            <div className="
                                                flex items-center
                                                gap-2
                                                mt-2
                                            ">

                                                <span className="
                                                    text-blue-600
                                                    font-bold
                                                ">
                                                    $
                                                    {itemPrice.toFixed(2)}
                                                </span>

                                                {hasDiscount && (
                                                    <span className="
                                                        text-xs
                                                        text-gray-400
                                                        line-through
                                                    ">
                                                        $
                                                        {originalPrice.toFixed(
                                                            2
                                                        )}
                                                    </span>
                                                )}

                                            </div>

                                            {/* Quantity + Total */}

                                            <div className="
                                                flex
                                                items-center
                                                justify-between
                                                mt-3
                                            ">

                                                <div className="
                                                    flex
                                                    items-center
                                                    bg-white
                                                    border
                                                    border-gray-200
                                                    rounded-xl
                                                    overflow-hidden
                                                ">

                                                    <button
                                                        onClick={() =>
                                                            dispatch(
                                                                decreaseQuantity(
                                                                    item._id
                                                                )
                                                            )
                                                        }
                                                        className="
                                                            w-8 h-8
                                                            flex
                                                            items-center
                                                            justify-center
                                                            hover:bg-gray-100
                                                            transition
                                                        "
                                                    >
                                                        <Minus size={14} />
                                                    </button>

                                                    <span className="
                                                        w-9
                                                        text-center
                                                        text-sm
                                                        font-bold
                                                    ">
                                                        {item.quantity}
                                                    </span>

                                                    <button
                                                        onClick={() =>
                                                            dispatch(
                                                                increaseQuantity(
                                                                    item._id
                                                                )
                                                            )
                                                        }
                                                        className="
                                                            w-8 h-8
                                                            flex
                                                            items-center
                                                            justify-center
                                                            hover:bg-gray-100
                                                            transition
                                                        "
                                                    >
                                                        <Plus size={14} />
                                                    </button>

                                                </div>

                                                <span className="
                                                    font-bold
                                                    text-gray-900
                                                ">
                                                    $
                                                    {itemTotal.toFixed(2)}
                                                </span>

                                            </div>

                                        </div>

                                    </div>
                                );
                            })}

                        </div>
                    )}

                </div>

                {/* ================= FOOTER ================= */}

                {cartItems.length > 0 && (

                    <div className="
                        border-t
                        border-gray-100
                        bg-white
                        px-6
                        py-5
                        shadow-[0_-8px_30px_rgba(0,0,0,0.05)]
                    ">

                        {/* Summary */}

                        <div className="space-y-3 mb-5">

                            <div className="
                                flex
                                justify-between
                                text-sm
                                text-gray-500
                            ">
                                <span>Subtotal</span>

                                <span>
                                    $
                                    {Number(
                                        totalPrice
                                    ).toFixed(2)}
                                </span>
                            </div>

                            <div className="
                                flex
                                justify-between
                                text-sm
                                text-gray-500
                            ">
                                <span>Shipping</span>

                                <span className="text-green-600 font-medium">
                                    Free
                                </span>
                            </div>

                            <div className="
                                border-t
                                border-gray-100
                                pt-3
                                flex
                                items-center
                                justify-between
                            ">
                                <span className="
                                    text-lg
                                    font-bold
                                    text-gray-900
                                ">
                                    Total
                                </span>

                                <span className="
                                    text-2xl
                                    font-black
                                    text-gray-900
                                ">
                                    $
                                    {Number(
                                        totalPrice
                                    ).toFixed(2)}
                                </span>
                            </div>

                        </div>

                        {/* Checkout */}

                        <button
                            className="
                                w-full
                                py-3.5
                                rounded-xl
                                bg-gray-900
                                text-white
                                font-bold
                                flex
                                items-center
                                justify-center
                                gap-2
                                hover:bg-blue-600
                                transition-all
                                duration-300
                                hover:shadow-lg
                                hover:-translate-y-0.5
                            "
                              onClick={() => navigate("/checkout")}
                        >
                            Proceed to Checkout

                            <ArrowRight size={18} />
                        </button>

                        {/* Security */}

                        <div className="
                            flex
                            items-center
                            justify-center
                            gap-2
                            mt-4
                            text-xs
                            text-gray-400
                        ">
                            <ShieldCheck size={15} />

                            Secure checkout
                        </div>

                    </div>

                )}

            </div>
        </div>
    );
};

export default AddToCart;