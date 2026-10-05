import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

import {
    ArrowLeft,
    Check,
    CreditCard,
    Lock,
    MapPin,
    Package,
    ShieldCheck,
    ShoppingBag,
    Truck,
} from "lucide-react";

import { clearCart } from "../redux/slices/cartSlice";

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // ==========================================
    // GET CART SAFELY FROM REDUX
    // ==========================================

    const cartState = useSelector((state) => state.cart);

    const cartItems = Array.isArray(cartState?.cartItems)
        ? cartState.cartItems
        : Array.isArray(cartState?.items)
        ? cartState.items
        : Array.isArray(cartState?.cart)
        ? cartState.cart
        : [];

    // ==========================================
    // STATES
    // ==========================================

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
    });

    // ==========================================
    // SUBTOTAL
    // ==========================================

    const subtotal = useMemo(() => {
        return cartItems.reduce((total, item) => {
            const price = Number(
                item?.price ??
                    item?.discountPrice ??
                    item?.product?.price ??
                    item?.product?.discountPrice ??
                    0
            );

            const quantity = Number(item?.quantity ?? 1);

            return total + price * quantity;
        }, 0);
    }, [cartItems]);

    // ==========================================
    // SHIPPING
    // ==========================================

    const shippingFee = subtotal >= 5000 ? 0 : 200;

    const total = subtotal + shippingFee;

    // ==========================================
    // INPUT CHANGE
    // ==========================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ==========================================
    // PLACE ORDER
    // ==========================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!Array.isArray(cartItems) || cartItems.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        try {
            setLoading(true);

            // ----------------------------------
            // PREPARE ORDER ITEMS
            // ----------------------------------

            const orderItems = cartItems.map((item) => {
                const productId =
                    item?._id ||
                    item?.product?._id ||
                    item?.product;

                const name =
                    item?.name ||
                    item?.product?.name ||
                    "Product";

                const image =
                    item?.image ||
                    item?.product?.image ||
                    "";

                const price = Number(
                    item?.price ??
                        item?.discountPrice ??
                        item?.product?.price ??
                        item?.product?.discountPrice ??
                        0
                );

                const quantity = Number(
                    item?.quantity ?? 1
                );

                return {
                    product: productId,
                    name,
                    image,
                    price,
                    quantity,
                };
            });

            // ----------------------------------
            // ORDER DATA
            // ----------------------------------

            const orderData = {
                items: orderItems,

                shippingAddress: {
                    fullName: formData.fullName.trim(),
                    phone: formData.phone.trim(),
                    address: formData.address.trim(),
                    city: formData.city.trim(),
                    postalCode: formData.postalCode.trim(),
                },

                paymentMethod: "COD",

                subtotal,
                shippingFee,
                total,
            };

            // ----------------------------------
            // API REQUEST
            // ----------------------------------

            const response = await axios.post(
                "http://localhost:3000/api/orders/create",
                orderData,
                {
                    withCredentials: true,
                }
            );
         
            // ----------------------------------
            // SUCCESS
            // ----------------------------------

            if (
                response?.data?.statusText ===
                "success"
            ) {
                toast.success(
                    "Order placed successfully!"
                );

                dispatch(clearCart());

                navigate("/order-success", {
                    state: {
                        order: response.data.order,
                    },
                });
            } else {
                toast.error(
                    response?.data?.message ||
                        "Unable to place order"
                );
            }
        } catch (error) {
            // console.error(
            //     "Checkout Error:",
            //     error
            // );

            toast.error(
                error?.response?.data?.message ||
                    "Failed to place order"
            );
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // EMPTY CART
    // ==========================================

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-6">

                <div className="text-center max-w-md">

                    <div className="mx-auto mb-6 w-24 h-24 rounded-3xl bg-white shadow-xl flex items-center justify-center">
                        <ShoppingBag
                            size={42}
                            className="text-slate-400"
                        />
                    </div>

                    <h2 className="text-3xl font-bold text-slate-900">
                        Your cart is empty
                    </h2>

                    <p className="text-slate-500 mt-3">
                        Looks like you haven't added
                        anything to your cart yet.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/products")
                        }
                        className="mt-7 inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-slate-900 text-white font-semibold shadow-lg shadow-slate-900/20 hover:-translate-y-0.5 transition-all"
                    >
                        <ShoppingBag size={18} />
                        Continue Shopping
                    </button>

                </div>
            </div>
        );
    }

    // ==========================================
    // MAIN CHECKOUT
    // ==========================================

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">

            {/* ======================================
                HEADER
            ======================================= */}

            <div className="border-b border-slate-200/70 bg-white/80 backdrop-blur-xl sticky top-0 z-40">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

                    <div className="flex items-center justify-between">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(-1)
                            }
                            className="group flex items-center gap-2 text-slate-600 hover:text-slate-900 transition"
                        >
                            <div className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center group-hover:bg-slate-100 transition">
                                <ArrowLeft
                                    size={17}
                                />
                            </div>

                            <span className="hidden sm:block font-medium">
                                Back to Cart
                            </span>
                        </button>

                        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                            <Lock size={15} />
                            Secure Checkout
                        </div>

                    </div>

                </div>

            </div>


            {/* ======================================
                MAIN
            ======================================= */}

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

                {/* TITLE */}

                <div className="mb-10">

                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                        <span>Cart</span>
                        <span>/</span>

                        <span className="text-slate-900 font-medium">
                            Checkout
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                        Complete your order
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Enter your delivery details and
                        review your order before placing it.
                    </p>

                </div>


                {/* ======================================
                    STEPS
                ======================================= */}

                <div className="hidden md:flex items-center mb-10">

                    <div className="flex items-center gap-3">

                        <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center">
                            <Check size={17} />
                        </div>

                        <span className="font-semibold text-slate-900">
                            Cart
                        </span>

                    </div>

                    <div className="w-24 h-px bg-slate-300 mx-4" />

                    <div className="flex items-center gap-3">

                        <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold">
                            2
                        </div>

                        <span className="font-semibold text-slate-900">
                            Checkout
                        </span>

                    </div>

                    <div className="w-24 h-px bg-slate-300 mx-4" />

                    <div className="flex items-center gap-3">

                        <div className="w-9 h-9 rounded-full border border-slate-300 text-slate-400 flex items-center justify-center text-sm font-bold">
                            3
                        </div>

                        <span className="text-slate-400 font-medium">
                            Confirmation
                        </span>

                    </div>

                </div>


                {/* ======================================
                    FORM
                ======================================= */}

                <form onSubmit={handleSubmit}>

                    <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">

                        {/* ==================================
                            LEFT
                        =================================== */}

                        <div className="space-y-6">

                            {/* SHIPPING */}

                            <section className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">

                                <div className="px-6 py-5 border-b border-slate-100">

                                    <div className="flex items-center gap-3">

                                        <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center">

                                            <MapPin
                                                size={20}
                                                className="text-slate-700"
                                            />

                                        </div>

                                        <div>

                                            <h2 className="text-lg font-bold text-slate-900">
                                                Shipping information
                                            </h2>

                                            <p className="text-sm text-slate-500">
                                                Where should we deliver your order?
                                            </p>

                                        </div>

                                    </div>

                                </div>


                                <div className="p-6">

                                    <div className="grid sm:grid-cols-2 gap-5">

                                        {/* NAME */}

                                        <div>

                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Full name
                                            </label>

                                            <input
                                                type="text"
                                                name="fullName"
                                                value={
                                                    formData.fullName
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                required
                                                placeholder="Muhammad Shakir"
                                                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/5"
                                            />

                                        </div>


                                        {/* PHONE */}

                                        <div>

                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Phone number
                                            </label>

                                            <input
                                                type="tel"
                                                name="phone"
                                                value={
                                                    formData.phone
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                required
                                                placeholder="03XX-XXXXXXX"
                                                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/5"
                                            />

                                        </div>


                                        {/* ADDRESS */}

                                        <div className="sm:col-span-2">

                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Delivery address
                                            </label>

                                            <textarea
                                                name="address"
                                                value={
                                                    formData.address
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                required
                                                rows="3"
                                                placeholder="House number, street, area..."
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 outline-none resize-none transition focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/5"
                                            />

                                        </div>


                                        {/* CITY */}

                                        <div>

                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                City
                                            </label>

                                            <input
                                                type="text"
                                                name="city"
                                                value={
                                                    formData.city
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                required
                                                placeholder="Lahore"
                                                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/5"
                                            />

                                        </div>


                                        {/* POSTAL */}

                                        <div>

                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Postal code
                                            </label>

                                            <input
                                                type="text"
                                                name="postalCode"
                                                value={
                                                    formData.postalCode
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                required
                                                placeholder="54000"
                                                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/5"
                                            />

                                        </div>

                                    </div>

                                </div>

                            </section>


                            {/* PAYMENT */}

                            <section className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">

                                <div className="px-6 py-5 border-b border-slate-100">

                                    <div className="flex items-center gap-3">

                                        <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center">

                                            <CreditCard
                                                size={20}
                                                className="text-slate-700"
                                            />

                                        </div>

                                        <div>

                                            <h2 className="text-lg font-bold text-slate-900">
                                                Payment method
                                            </h2>

                                            <p className="text-sm text-slate-500">
                                                Select how you want to pay
                                            </p>

                                        </div>

                                    </div>

                                </div>


                                <div className="p-6">

                                    <div className="relative border-2 border-slate-900 rounded-2xl p-5 bg-slate-50">

                                        <div className="absolute top-4 right-4">

                                            <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center">

                                                <Check
                                                    size={14}
                                                    className="text-white"
                                                />

                                            </div>

                                        </div>


                                        <div className="flex items-start gap-4">

                                            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">

                                                <Truck
                                                    size={21}
                                                    className="text-slate-700"
                                                />

                                            </div>


                                            <div>

                                                <p className="font-bold text-slate-900">
                                                    Cash on Delivery
                                                </p>

                                                <p className="text-sm text-slate-500 mt-1 max-w-md">
                                                    Pay securely in cash
                                                    when your order is
                                                    delivered to your
                                                    doorstep.
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </section>


                            {/* SECURITY */}

                            <div className="grid sm:grid-cols-3 gap-3">

                                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3">

                                    <ShieldCheck
                                        size={20}
                                        className="text-slate-700"
                                    />

                                    <span className="text-xs font-semibold text-slate-600">
                                        Secure checkout
                                    </span>

                                </div>


                                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3">

                                    <Truck
                                        size={20}
                                        className="text-slate-700"
                                    />

                                    <span className="text-xs font-semibold text-slate-600">
                                        Fast delivery
                                    </span>

                                </div>


                                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3">

                                    <Package
                                        size={20}
                                        className="text-slate-700"
                                    />

                                    <span className="text-xs font-semibold text-slate-600">
                                        Quality products
                                    </span>

                                </div>

                            </div>

                        </div>


                        {/* ==================================
                            RIGHT — ORDER SUMMARY
                        =================================== */}

                        <aside className="lg:sticky lg:top-24">

                            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-lg shadow-slate-900/5 overflow-hidden">

                                {/* SUMMARY HEADER */}

                                <div className="px-6 py-5 border-b border-slate-100">

                                    <div className="flex items-center gap-3">

                                        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">

                                            <ShoppingBag
                                                size={18}
                                                className="text-white"
                                            />

                                        </div>

                                        <div>

                                            <h2 className="font-bold text-slate-900">
                                                Order summary
                                            </h2>

                                            <p className="text-xs text-slate-500">
                                                {cartItems.length}{" "}
                                                {cartItems.length ===
                                                1
                                                    ? "item"
                                                    : "items"}
                                            </p>

                                        </div>

                                    </div>

                                </div>


                                {/* PRODUCTS */}

                                <div className="p-6 space-y-5 max-h-[360px] overflow-y-auto">

                                    {cartItems.map(
                                        (item, index) => {

                                            const price =
                                                Number(
                                                    item?.price ??
                                                        item?.discountPrice ??
                                                        item?.product
                                                            ?.price ??
                                                        item?.product
                                                            ?.discountPrice ??
                                                        0
                                                );

                                            const quantity =
                                                Number(
                                                    item?.quantity ??
                                                        1
                                                );

                                            const name =
                                                item?.name ||
                                                item?.product
                                                    ?.name ||
                                                "Product";

                                            const image =
                                                item?.image ||
                                                item?.product
                                                    ?.image ||
                                                "";

                                            return (
                                                <div
                                                    key={
                                                        item?._id ||
                                                        item?.product
                                                            ?._id ||
                                                        index
                                                    }
                                                    className="flex gap-3"
                                                >

                                                    <div className="relative w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">

                                                        {image ? (
                                                            <img
                                                                src={
                                                                    image
                                                                }
                                                                alt={
                                                                    name
                                                                }
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">

                                                                <Package
                                                                    size={
                                                                        22
                                                                    }
                                                                    className="text-slate-400"
                                                                />

                                                            </div>
                                                        )}

                                                        <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold">
                                                            {
                                                                quantity
                                                            }
                                                        </span>

                                                    </div>


                                                    <div className="flex-1 min-w-0">

                                                        <p className="font-semibold text-sm text-slate-900 line-clamp-2">
                                                            {
                                                                name
                                                            }
                                                        </p>

                                                        <p className="text-xs text-slate-500 mt-1">
                                                            Qty:{" "}
                                                            {
                                                                quantity
                                                            }
                                                        </p>

                                                    </div>


                                                    <div className="text-sm font-bold text-slate-900 whitespace-nowrap">
                                                        Rs.{" "}
                                                        {(
                                                            price *
                                                            quantity
                                                        ).toLocaleString()}
                                                    </div>

                                                </div>
                                            );
                                        }
                                    )}

                                </div>


                                {/* TOTALS */}

                                <div className="border-t border-slate-100 p-6">

                                    <div className="space-y-3">

                                        <div className="flex justify-between text-sm">

                                            <span className="text-slate-500">
                                                Subtotal
                                            </span>

                                            <span className="font-medium text-slate-900">
                                                Rs.{" "}
                                                {subtotal.toLocaleString()}
                                            </span>

                                        </div>


                                        <div className="flex justify-between text-sm">

                                            <span className="text-slate-500">
                                                Delivery
                                            </span>

                                            <span
                                                className={
                                                    shippingFee ===
                                                    0
                                                        ? "font-semibold text-emerald-600"
                                                        : "font-medium text-slate-900"
                                                }
                                            >
                                                {shippingFee ===
                                                0
                                                    ? "FREE"
                                                    : `Rs. ${shippingFee}`}
                                            </span>

                                        </div>

                                    </div>


                                    {/* FREE SHIPPING MESSAGE */}

                                    {shippingFee > 0 &&
                                        subtotal < 5000 && (
                                            <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3">

                                                <p className="text-xs text-slate-500">

                                                    Add{" "}

                                                    <span className="font-bold text-slate-900">

                                                        Rs.{" "}
                                                        {(
                                                            5000 -
                                                            subtotal
                                                        ).toLocaleString()}

                                                    </span>{" "}

                                                    more to get free
                                                    delivery.

                                                </p>

                                            </div>
                                        )}


                                    {/* TOTAL */}

                                    <div className="border-t border-slate-200 mt-5 pt-5 flex items-end justify-between">

                                        <div>

                                            <p className="text-sm text-slate-500">
                                                Total
                                            </p>

                                            <p className="text-2xl font-black text-slate-900 mt-1">
                                                Rs.{" "}
                                                {total.toLocaleString()}
                                            </p>

                                        </div>

                                        <span className="text-xs text-slate-400 mb-1">
                                            PKR
                                        </span>

                                    </div>


                                    {/* PLACE ORDER */}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full mt-6 h-14 rounded-2xl bg-slate-900 text-white font-bold flex items-center justify-center gap-2 shadow-xl shadow-slate-900/20 hover:bg-slate-800 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                    >

                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />

                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                Place Order

                                                <ArrowLeft
                                                    size={18}
                                                    className="rotate-180"
                                                />
                                            </>
                                        )}

                                    </button>


                                    <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-400">

                                        <Lock size={12} />

                                        Your information is encrypted
                                        and secure

                                    </div>

                                </div>

                            </div>

                        </aside>

                    </div>

                </form>

            </main>

        </div>
    );
};

export default Checkout;
