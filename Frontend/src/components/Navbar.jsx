
import React, { useState } from "react";

import {
    ShoppingCart,
    User,
    LogOut,
    LayoutDashboard,
    Home,
    Package,
    Menu,
    X,
    Truck,
    ChevronDown,
} from "lucide-react";

import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/slices/authSlice";

// Cart Drawer
import AddToCart from "../pages/AddToCart";

function Navbar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [cartOpen, setCartOpen] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    // =========================
    // AUTH FROM REDUX
    // =========================
    const {
        user,
        isLogin,
        accessToken,
    } = useSelector((state) => state.auth);

    // =========================
    // CART FROM REDUX
    // =========================
    const totalQuantity = useSelector(
        (state) => state.cart.totalQuantity
    );

    // =========================
    // LOGOUT
    // =========================
    const Logout = async () => {
        try {
            await axios.post(
                "http://localhost:3000/api/auth/logout",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    withCredentials: true,
                }
            );

            toast.success("Logout successful");
        } catch (error) {
            console.log(
                "Logout error:",
                error.response?.data || error.message
            );
        } finally {
            // Always clear frontend auth state
            dispatch(logoutUser());

            navigate("/login");
        }
    };

    return (
        <>
            {/* =========================
                CART DRAWER
            ========================= */}

            <AddToCart
                isOpen={cartOpen}
                onClose={() => setCartOpen(false)}
            />

            <header
                className="
                    sticky
                    top-0
                    z-50
                    w-full
                    bg-white/90
                    backdrop-blur-xl
                    border-b
                    border-gray-200
                    shadow-sm
                "
            >

                {/* =========================
                    DESKTOP NAVBAR
                ========================= */}

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="h-20 flex items-center justify-between">

                        {/* =========================
                            LOGO
                        ========================= */}

                        <Link
                            to="/"
                            className="flex items-center gap-3 group"
                        >

                            <div
                                className="
                                    w-11
                                    h-11
                                    rounded-xl
                                    bg-gradient-to-br
                                    from-blue-600
                                    to-purple-600
                                    flex
                                    items-center
                                    justify-center
                                    shadow-lg
                                    group-hover:scale-105
                                    transition-transform
                                "
                            >
                                <ShoppingCart
                                    size={23}
                                    className="text-white"
                                />
                            </div>

                            <div>

                                <h1
                                    className="
                                        text-xl
                                        font-extrabold
                                        tracking-tight
                                        text-gray-900
                                    "
                                >
                                    Shop
                                    <span className="text-blue-600">
                                        Zone
                                    </span>
                                </h1>

                                <p
                                    className="
                                        text-[10px]
                                        text-gray-400
                                        uppercase
                                        tracking-widest
                                    "
                                >
                                    Premium Store
                                </p>

                            </div>

                        </Link>

                        {/* =========================
                            DESKTOP LINKS
                        ========================= */}

                        <nav
                            className="
                                hidden
                                md:flex
                                items-center
                                gap-8
                            "
                        >

                            <Link
                                to="/"
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    text-gray-600
                                    font-medium
                                    hover:text-blue-600
                                    transition
                                "
                            >
                                <Home size={17} />
                                Home
                            </Link>

                            <Link
                                to="/Products"
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    text-gray-600
                                    font-medium
                                    hover:text-blue-600
                                    transition
                                "
                            >
                                <Package size={17} />
                                Products
                            </Link>

                            {/* Admin Dashboard */}

                            {isLogin && user?.role === "admin" && (
                                <Link
                                    to="/dashboard"
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        text-gray-600
                                        font-medium
                                        hover:text-blue-600
                                        transition
                                    "
                                >
                                    <LayoutDashboard size={17} />
                                    Dashboard
                                </Link>
                            )}

                        </nav>

                        {/* =========================
                            RIGHT SECTION
                        ========================= */}

                        <div className="flex items-center gap-3">

                            {/* =========================
                                USER
                            ========================= */}

                            {isLogin && user && (
                                <div className="relative hidden sm:block">

                                    {/* User Button */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setProfileOpen((prev) => !prev)
                                        }
                                        className="
                flex
                items-center
                gap-3
                px-3
                py-2
                rounded-xl
                bg-gray-50
                border
                border-gray-200
                hover:bg-white
                hover:border-blue-200
                hover:shadow-md
                transition-all
                duration-200
            "
                                    >

                                        {/* Avatar */}
                                        <div
                                            className="
                    w-9
                    h-9
                    rounded-full
                    bg-gradient-to-br
                    from-blue-500
                    to-purple-600
                    flex
                    items-center
                    justify-center
                    shadow-sm
                "
                                        >
                                            <User
                                                size={17}
                                                className="text-white"
                                            />
                                        </div>

                                        {/* Name */}
                                        <div className="text-left leading-tight">
                                            <p className="text-[11px] text-gray-400">
                                                Welcome
                                            </p>

                                            <p className="text-sm font-bold text-gray-800">
                                                {user.firstName || "User"}
                                            </p>
                                        </div>

                                        {/* Arrow */}
                                        <ChevronDown
                                            size={16}
                                            className={`
                    text-gray-400
                    transition-transform
                    duration-200
                    ${profileOpen ? "rotate-180" : ""}
                `}
                                        />

                                    </button>


                                    {/* Dropdown */}
                                    {profileOpen && (
                                        <div
                                            className="
                    absolute
                    right-0
                    top-[calc(100%+10px)]
                    w-64
                    bg-white/95
                    backdrop-blur-xl
                    border
                    border-gray-200
                    rounded-2xl
                    shadow-2xl
                    p-2
                    z-[100]
                    animate-in
                    fade-in
                    slide-in-from-top-2
                    duration-200
                "
                                        >

                                            {/* User Info */}
                                            <div
                                                className="
                        px-3
                        py-3
                        mb-1
                        rounded-xl
                        bg-gradient-to-r
                        from-blue-50
                        to-purple-50
                        border
                        border-blue-100
                    "
                                            >
                                                <p className="text-sm font-bold text-gray-900">
                                                    {user.firstName || "User"}
                                                    {user.lastName
                                                        ? ` ${user.lastName}`
                                                        : ""}
                                                </p>

                                                <p className="text-xs text-gray-500 truncate">
                                                    {user.email}
                                                </p>
                                            </div>


                                            {/* My Orders */}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setProfileOpen(false);
                                                    navigate("/my-orders");
                                                }}
                                                className="
                        w-full
                        flex
                        items-center
                        gap-3
                        px-3
                        py-3
                        rounded-xl
                        text-left
                        text-sm
                        font-medium
                        text-gray-700
                        hover:bg-blue-50
                        hover:text-blue-600
                        transition
                    "
                                            >
                                                <div
                                                    className="
                            w-9
                            h-9
                            rounded-lg
                            bg-blue-50
                            flex
                            items-center
                            justify-center
                        "
                                                >
                                                    <Package
                                                        size={18}
                                                        className="text-blue-600"
                                                    />
                                                </div>

                                                <div>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setProfileOpen(false);
                                                            navigate("/My-Order");
                                                        }}
                                                        className="font-semibold">
                                                        My Orders
                                                    </button>

                                                    <p className="text-[11px] text-gray-400">
                                                        View your orders
                                                    </p>
                                                </div>
                                            </button>


                                            {/* Track Order */}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setProfileOpen(false);
                                                    navigate("/track-order");
                                                }}
                                                className="
                        w-full
                        flex
                        items-center
                        gap-3
                        px-3
                        py-3
                        rounded-xl
                        text-left
                        text-sm
                        font-medium
                        text-gray-700
                        hover:bg-purple-50
                        hover:text-purple-600
                        transition
                    "
                                            >
                                                <div
                                                    className="
                            w-9
                            h-9
                            rounded-lg
                            bg-purple-50
                            flex
                            items-center
                            justify-center
                        "
                                                >
                                                    <Truck
                                                        size={18}
                                                        className="text-purple-600"
                                                    />
                                                </div>

                                                <div>
                                                    <p className="font-semibold">
                                                        Track My Order
                                                    </p>

                                                    <p className="text-[11px] text-gray-400">
                                                        Track your package
                                                    </p>
                                                </div>
                                            </button>


                                            {/* Divider */}
                                            <div className="my-2 border-t border-gray-100" />


                                            {/* Logout */}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setProfileOpen(false);
                                                    Logout();
                                                }}
                                                className="
                        w-full
                        flex
                        items-center
                        gap-3
                        px-3
                        py-3
                        rounded-xl
                        text-left
                        text-sm
                        font-semibold
                        text-red-600
                        hover:bg-red-50
                        transition
                    "
                                            >
                                                <div
                                                    className="
                            w-9
                            h-9
                            rounded-lg
                            bg-red-50
                            flex
                            items-center
                            justify-center
                        "
                                                >
                                                    <LogOut
                                                        size={18}
                                                        className="text-red-500"
                                                    />
                                                </div>

                                                <div>
                                                    <p>Logout</p>

                                                    <p className="text-[11px] text-red-400">
                                                        Sign out of your account
                                                    </p>
                                                </div>
                                            </button>

                                        </div>
                                    )}

                                </div>
                            )}

                            {/* =========================
                                CART
                            ========================= */}

                            <button
                                type="button"
                                onClick={() => setCartOpen(true)}
                                className="
                                    relative
                                    w-11
                                    h-11
                                    rounded-xl
                                    bg-gray-100
                                    flex
                                    items-center
                                    justify-center
                                    hover:bg-blue-50
                                    hover:text-blue-600
                                    transition
                                    group
                                "
                            >

                                <ShoppingCart
                                    size={21}
                                    className="
                                        group-hover:scale-110
                                        transition-transform
                                    "
                                />

                                {totalQuantity > 0 && (
                                    <span
                                        className="
                                            absolute
                                            -top-1.5
                                            -right-1.5
                                            min-w-[20px]
                                            h-5
                                            px-1
                                            rounded-full
                                            bg-red-500
                                            text-white
                                            text-[11px]
                                            font-bold
                                            flex
                                            items-center
                                            justify-center
                                            border-2
                                            border-white
                                        "
                                    >
                                        {totalQuantity}
                                    </span>
                                )}

                            </button>

                            {/* =========================
                                LOGIN / LOGOUT
                            ========================= */}

                            {isLogin ? (

                                <button
                                    onClick={Logout}
                                    className="
                                        hidden
                                        sm:flex
                                        items-center
                                        gap-2
                                        bg-gray-900
                                        text-white
                                        px-5
                                        py-2.5
                                        rounded-xl
                                        font-semibold
                                        hover:bg-red-600
                                        transition-all
                                        duration-300
                                    "
                                >
                                    <LogOut size={17} />
                                    Logout
                                </button>

                            ) : (

                                <button
                                    onClick={() => navigate("/login")}
                                    className="
                                        hidden
                                        sm:flex
                                        items-center
                                        gap-2
                                        bg-blue-600
                                        text-white
                                        px-5
                                        py-2.5
                                        rounded-xl
                                        font-semibold
                                        hover:bg-blue-700
                                        hover:shadow-lg
                                        hover:shadow-blue-200
                                        transition-all
                                        duration-300
                                    "
                                >
                                    <User size={17} />
                                    Login
                                </button>

                            )}

                            {/* =========================
                                MOBILE MENU BUTTON
                            ========================= */}

                            <button
                                type="button"
                                onClick={() =>
                                    setMobileMenu((prev) => !prev)
                                }
                                className="
                                    md:hidden
                                    w-11
                                    h-11
                                    rounded-xl
                                    bg-gray-100
                                    flex
                                    items-center
                                    justify-center
                                    hover:bg-gray-200
                                    transition
                                "
                            >

                                {mobileMenu ? (
                                    <X size={22} />
                                ) : (
                                    <Menu size={22} />
                                )}

                            </button>

                        </div>

                    </div>

                    {/* =========================
                        MOBILE MENU
                    ========================= */}

                    {mobileMenu && (
                        <div
                            className="
                                md:hidden
                                border-t
                                border-gray-200
                                py-5
                            "
                        >

                            <nav className="flex flex-col gap-2">

                                {/* Home */}

                                <Link
                                    to="/"
                                    onClick={() =>
                                        setMobileMenu(false)
                                    }
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                        px-4
                                        py-3
                                        rounded-xl
                                        hover:bg-blue-50
                                        hover:text-blue-600
                                        font-medium
                                        transition
                                    "
                                >
                                    <Home size={18} />
                                    Home
                                </Link>

                                {/* Products */}

                                <Link
                                    to="/Products"
                                    onClick={() =>
                                        setMobileMenu(false)
                                    }
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                        px-4
                                        py-3
                                        rounded-xl
                                        hover:bg-blue-50
                                        hover:text-blue-600
                                        font-medium
                                        transition
                                    "
                                >
                                    <Package size={18} />
                                    Products
                                </Link>

                                {/* Admin Dashboard */}

                                {isLogin &&
                                    user?.role === "admin" && (
                                        <Link
                                            to="/dashboard"
                                            onClick={() =>
                                                setMobileMenu(false)
                                            }
                                            className="
                                                flex
                                                items-center
                                                gap-3
                                                px-4
                                                py-3
                                                rounded-xl
                                                hover:bg-blue-50
                                                hover:text-blue-600
                                                font-medium
                                                transition
                                            "
                                        >
                                            <LayoutDashboard
                                                size={18}
                                            />
                                            Dashboard
                                        </Link>
                                    )}

                                {/* =========================
                                    MOBILE CART
                                ========================= */}

                                <button
                                    type="button"
                                    onClick={() => {
                                        setMobileMenu(false);
                                        setCartOpen(true);
                                    }}
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        px-4
                                        py-3
                                        rounded-xl
                                        hover:bg-blue-50
                                        hover:text-blue-600
                                        font-medium
                                        transition
                                        w-full
                                    "
                                >

                                    <div className="flex items-center gap-3">
                                        <ShoppingCart size={18} />
                                        Cart
                                    </div>

                                    {totalQuantity > 0 && (
                                        <span
                                            className="
                                                min-w-[22px]
                                                h-5
                                                px-1
                                                rounded-full
                                                bg-red-500
                                                text-white
                                                text-[11px]
                                                font-bold
                                                flex
                                                items-center
                                                justify-center
                                            "
                                        >
                                            {totalQuantity}
                                        </span>
                                    )}

                                </button>

                                {/* =========================
                                    MOBILE USER
                                ========================= */}

                                {isLogin && user && (
                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-3
                                            px-4
                                            py-3
                                            mt-2
                                            bg-gray-50
                                            rounded-xl
                                        "
                                    >

                                        <div
                                            className="
                                                w-10
                                                h-10
                                                rounded-full
                                                bg-gradient-to-br
                                                from-blue-500
                                                to-purple-600
                                                flex
                                                items-center
                                                justify-center
                                            "
                                        >
                                            <User
                                                size={18}
                                                className="text-white"
                                            />
                                        </div>

                                        <div>

                                            <p className="text-xs text-gray-400">
                                                Welcome back
                                            </p>

                                            <p className="font-bold">
                                                {user.firstName || "User"}
                                            </p>

                                        </div>

                                    </div>
                                )}

                                {/* =========================
                                    MOBILE LOGIN / LOGOUT
                                ========================= */}

                                {isLogin ? (

                                    <button
                                        onClick={Logout}
                                        className="
                                            flex
                                            items-center
                                            justify-center
                                            gap-2
                                            w-full
                                            mt-2
                                            bg-red-500
                                            text-white
                                            py-3
                                            rounded-xl
                                            font-semibold
                                            hover:bg-red-600
                                            transition
                                        "
                                    >
                                        <LogOut size={18} />
                                        Logout
                                    </button>

                                ) : (

                                    <button
                                        onClick={() => {
                                            setMobileMenu(false);
                                            navigate("/login");
                                        }}
                                        className="
                                            flex
                                            items-center
                                            justify-center
                                            gap-2
                                            w-full
                                            mt-2
                                            bg-blue-600
                                            text-white
                                            py-3
                                            rounded-xl
                                            font-semibold
                                            hover:bg-blue-700
                                            transition
                                        "
                                    >
                                        <User size={18} />
                                        Login
                                    </button>

                                )}

                            </nav>

                        </div>
                    )}

                </div>

            </header>
        </>
    );
}

export default Navbar;
