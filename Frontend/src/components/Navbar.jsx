
import React, { useEffect, useState } from "react";
import {
    ShoppingCart,
    User,
    LogOut,
    LayoutDashboard,
    Home,
    Package,
    Menu,
    X,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { AddToCart } from "../pages/AddToCart.jsx";

// Redux
import { useSelector } from "react-redux";

function Navbar() {
    const navigate = useNavigate();
    const [cartOpen, setCartOpen] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [user, setUser] = useState(null);
    const [mobileMenu, setMobileMenu] = useState(false);

    // =========================
    // Redux Cart Count
    // =========================
    const totalQuantity = useSelector(
        (state) => state.cart.totalQuantity
    );

    // =========================
    // Load User
    // =========================
    const loadUser = () => {
        const accessToken = localStorage.getItem("accessToken");
        const storedUser = localStorage.getItem("user");

        if (accessToken && storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);

                setUser(parsedUser);
                setIsLogin(true);
            } catch (error) {
                console.error("Invalid user data:", error);

                setUser(null);
                setIsLogin(false);
            }
        } else {
            setUser(null);
            setIsLogin(false);
        }
    };

    // =========================
    // Load User on Mount
    // =========================
    useEffect(() => {
        loadUser();

        const handleStorageChange = () => {
            loadUser();
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    // =========================
    // Logout
    // =========================
    const Logout = async () => {
        try {
            const token = localStorage.getItem("accessToken");

            await axios.post(
                "http://localhost:3000/api/auth/logout",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );

            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            localStorage.removeItem("username");

            setUser(null);
            setIsLogin(false);

            toast.success("Logout successful");

            navigate("/login");
        } catch (error) {
            console.log(
                "Logout error:",
                error.response?.data || error.message
            );

            toast.error("Logout failed");
        }
    };

    return (
        <>
            <AddToCart
                isOpen={cartOpen}
                onClose={() => setCartOpen(false)}
            />
            <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm">

                {/* =========================
                Desktop Navbar
            ========================== */}

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="h-20 flex items-center justify-between">

                        {/* Logo */}
                        <Link
                            to="/"
                            className="flex items-center gap-3 group"
                        >
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                <ShoppingCart
                                    size={23}
                                    className="text-white"
                                />
                            </div>

                            <div>
                                <h1 className="text-xl font-extrabold tracking-tight text-gray-900">
                                    Shop<span className="text-blue-600">Zone</span>
                                </h1>

                                <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                                    Premium Store
                                </p>
                            </div>
                        </Link>

                        {/* Desktop Links */}
                        <nav className="hidden md:flex items-center gap-8">

                            <Link
                                to="/"
                                className="flex items-center gap-2 text-gray-600 font-medium hover:text-blue-600 transition"
                            >
                                <Home size={17} />
                                Home
                            </Link>

                            <Link
                                to="/Products"
                                className="flex items-center gap-2 text-gray-600 font-medium hover:text-blue-600 transition"
                            >
                                <Package size={17} />
                                Products
                            </Link>

                            {isLogin && user?.role === "admin" && (
                                <Link
                                    to="/dashboard"
                                    className="flex items-center gap-2 text-gray-600 font-medium hover:text-blue-600 transition"
                                >
                                    <LayoutDashboard size={17} />
                                    Dashboard
                                </Link>
                            )}
                        </nav>

                        {/* Right Section */}
                        <div className="flex items-center gap-3">

                            {/* User */}
                            {isLogin && user && (
                                <div className="hidden sm:flex items-center gap-3 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200">

                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                        <User
                                            size={17}
                                            className="text-white"
                                        />
                                    </div>

                                    <div className="leading-tight">
                                        <p className="text-[11px] text-gray-400">
                                            Welcome
                                        </p>

                                        <p className="text-sm font-bold text-gray-800">
                                            {user.firstName || "User"}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Cart */}
                            <Link
                                to='/add-to-cart'
                                className="relative w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition group"
                            >
                                <ShoppingCart
                                    onClick={() => setCartOpen(true)}
                                    size={21}
                                    className="group-hover:scale-110 transition-transform"
                                />

                                {/* Redux Cart Count */}
                                {totalQuantity > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center border-2 border-white">
                                        {totalQuantity}
                                    </span>
                                )}
                            </Link>

                            {/* Login / Logout */}
                            {isLogin ? (
                                <button
                                    onClick={Logout}
                                    className="hidden sm:flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-red-600 transition-all duration-300"
                                >
                                    <LogOut size={17} />
                                    Logout
                                </button>
                            ) : (
                                <button
                                    onClick={() => navigate("/login")}
                                    className="hidden sm:flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all duration-300"
                                >
                                    <User size={17} />
                                    Login
                                </button>
                            )}

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setMobileMenu(!mobileMenu)}
                                className="md:hidden w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
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
                    Mobile Menu
                ========================== */}

                    {mobileMenu && (
                        <div className="md:hidden border-t border-gray-200 py-5">

                            <nav className="flex flex-col gap-2">

                                <Link
                                    to="/"
                                    onClick={() => setMobileMenu(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 hover:text-blue-600 font-medium transition"
                                >
                                    <Home size={18} />
                                    Home
                                </Link>

                                <Link
                                    to="/Products"
                                    onClick={() => setMobileMenu(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 hover:text-blue-600 font-medium transition"
                                >
                                    <Package size={18} />
                                    Products
                                </Link>

                                {isLogin && user?.role === "admin" && (
                                    <Link
                                        to="/dashboard"
                                        onClick={() => setMobileMenu(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 hover:text-blue-600 font-medium transition"
                                    >
                                        <LayoutDashboard size={18} />
                                        Dashboard
                                    </Link>
                                )}

                                {/* Mobile Cart */}
                                <Link
                                    to='/add-to-cart'
                      
                                    onClick={() => {
                                        setMobileMenu(false);
                                        setCartOpen(true);
                                    }}
                                    className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-blue-50 hover:text-blue-600 font-medium transition"
                                >
                                    <div className="flex items-center gap-3">
                                        <ShoppingCart size={18} />
                                        Cart
                                    </div>

                                    {totalQuantity > 0 && (
                                        <span className="min-w-[22px] h-5 px-1 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center">
                                            {totalQuantity}
                                        </span>
                                    )}
                                </Link>

                                {isLogin && user && (
                                    <div className="flex items-center gap-3 px-4 py-3 mt-2 bg-gray-50 rounded-xl">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
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

                                {isLogin ? (
                                    <button
                                        onClick={Logout}
                                        className="flex items-center justify-center gap-2 w-full mt-2 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition"
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
                                        className="flex items-center justify-center gap-2 w-full mt-2 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
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
