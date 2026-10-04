import React from "react";
import { Link } from "react-router-dom";
import {
    ShoppingBag,
    Mail,
    Phone,
    MapPin,
    ArrowRight,
    Heart,
} from "lucide-react";
import {
    FaFacebookF,
    FaInstagram,
    FaTwitter,
} from "react-icons/fa";

function Footer() {
    return (
        <footer className="bg-gray-950 text-white">

            {/* ================= Newsletter ================= */}
            <div className="border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-10 flex flex-col lg:flex-row items-center justify-between gap-8">

                        <div>
                            <p className="text-blue-100 text-sm font-semibold uppercase tracking-widest">
                                Stay Updated
                            </p>

                            <h2 className="text-2xl md:text-3xl font-bold mt-2">
                                Get the latest offers & deals
                            </h2>

                            <p className="text-blue-100 mt-2">
                                Subscribe to our newsletter and never miss an offer.
                            </p>
                        </div>

                        <div className="flex w-full lg:w-auto bg-white rounded-xl p-1.5">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 lg:w-72 px-4 py-3 text-gray-800 outline-none rounded-lg"
                            />

                            <button className="bg-gray-950 text-white px-5 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-800 transition">
                                Subscribe
                                <ArrowRight size={17} />
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* ================= Main Footer ================= */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* Brand */}
                    <div>

                        <Link
                            to="/"
                            className="flex items-center gap-3 mb-5"
                        >
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <ShoppingBag size={23} />
                            </div>

                            <div>
                                <h1 className="text-xl font-extrabold">
                                    Shop<span className="text-blue-500">Zone</span>
                                </h1>

                                <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                                    Premium Store
                                </p>
                            </div>
                        </Link>

                        <p className="text-gray-400 leading-7 text-sm">
                            Your trusted destination for quality products,
                            great prices and an exceptional shopping experience.
                        </p>

                        {/* Social Icons */}
                        <div className="flex items-center gap-3 mt-6">

                            <a
                                href="#"
                                className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition"
                            >
                                <FaFacebookF size={18} />
                            </a>

                            <a
                                href="#"
                                className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center hover:bg-pink-600 hover:border-pink-600 transition"
                            >
                                < FaInstagram size={18} />
                            </a>

                            <a
                                href="#"
                                className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center hover:bg-sky-500 hover:border-sky-500 transition"
                            >
                                <FaTwitter size={18} />
                            </a>

                        </div>

                    </div>

                    {/* Quick Links */}
                    <div>

                        <h3 className="text-lg font-bold mb-5">
                            Quick Links
                        </h3>

                        <ul className="space-y-3">

                            <li>
                                <Link
                                    to="/"
                                    className="text-gray-400 hover:text-blue-500 transition"
                                >
                                    Home
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/Products"
                                    className="text-gray-400 hover:text-blue-500 transition"
                                >
                                    Products
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/profile"
                                    className="text-gray-400 hover:text-blue-500 transition"
                                >
                                    My Profile
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/cart"
                                    className="text-gray-400 hover:text-blue-500 transition"
                                >
                                    Shopping Cart
                                </Link>
                            </li>

                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>

                        <h3 className="text-lg font-bold mb-5">
                            Customer Service
                        </h3>

                        <ul className="space-y-3">

                            <li>
                                <Link
                                    to="/retuen-policy"
                                    className="text-gray-400 hover:text-blue-500 transition"
                                >
                                    Return Policy
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/price-policy"
                                    className="text-gray-400 hover:text-blue-500 transition"
                                >
                                    Price Policy
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/term-and-constion"
                                    className="text-gray-400 hover:text-blue-500 transition"
                                >
                                    Terms & Conditions
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/contact"
                                    className="text-gray-400 hover:text-blue-500 transition"
                                >
                                    Contact Us
                                </Link>
                            </li>

                        </ul>
                    </div>

                    {/* Contact */}
                    <div>

                        <h3 className="text-lg font-bold mb-5">
                            Contact Us
                        </h3>

                        <div className="space-y-4">

                            <div className="flex items-start gap-3">

                                <div className="w-9 h-9 rounded-lg bg-gray-900 flex items-center justify-center shrink-0">
                                    <MapPin
                                        size={17}
                                        className="text-blue-500"
                                    />
                                </div>

                                <p className="text-gray-400 text-sm leading-6">
                                    Lahore, Punjab
                                    <br />
                                    Pakistan
                                </p>

                            </div>

                            <div className="flex items-center gap-3">

                                <div className="w-9 h-9 rounded-lg bg-gray-900 flex items-center justify-center shrink-0">
                                    <Mail
                                        size={17}
                                        className="text-blue-500"
                                    />
                                </div>

                                <p className="text-gray-400 text-sm">
                                    support@shopzone.com
                                </p>

                            </div>

                            <div className="flex items-center gap-3">

                                <div className="w-9 h-9 rounded-lg bg-gray-900 flex items-center justify-center shrink-0">
                                    <Phone
                                        size={17}
                                        className="text-blue-500"
                                    />
                                </div>

                                <p className="text-gray-400 text-sm">
                                    +92 300 1234567
                                </p>

                            </div>

                        </div>
                    </div>

                </div>
            </div>

            {/* ================= Bottom Footer ================= */}
            <div className="border-t border-gray-800">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">

                        <p className="text-sm text-gray-500 text-center md:text-left">
                            © {new Date().getFullYear()} ShopZone. All rights reserved.
                        </p>

                        <p className="text-sm text-gray-500 flex items-center gap-1">
                            Made with
                            <Heart
                                size={15}
                                className="text-red-500 fill-red-500"
                            />
                            for our customers
                        </p>

                    </div>

                </div>
            </div>

        </footer>
    );
}

export default Footer;