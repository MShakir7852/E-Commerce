import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag, Sparkles } from "lucide-react";
import img from "../assets/mobile.jpg";

function Hero() {
    return (
        <section className="w-full bg-gray-50">

            {/* Hero Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">

                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-purple-700 min-h-[520px] flex items-center">

                    {/* Background Decorations */}
                    <div className="absolute -top-32 -right-32 w-80 h-80 bg-white/10 rounded-full blur-2xl"></div>

                    <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>

                    <div className="absolute top-10 right-10 w-20 h-20 border border-white/10 rounded-full"></div>

                    {/* Content */}
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 w-full items-center gap-10 px-7 sm:px-10 lg:px-16 py-12">

                        {/* Left Side */}
                        <div className="text-center lg:text-left">

                            {/* Small Badge */}
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">

                                <Sparkles size={16} />

                                New Collection 2026
                            </div>

                            {/* Heading */}
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">

                                Latest
                                <span className="block text-blue-100">
                                    Smartphone
                                </span>

                                <span className="block">
                                    Experience
                                </span>

                            </h1>

                            {/* Description */}
                            <p className="mt-5 text-blue-100 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-7">
                                Discover the latest smartphones with powerful
                                performance, premium design and innovative
                                features built for your everyday life.
                            </p>

                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mt-8">

                                <Link
                                    to="/products"
                                    className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-6 py-3.5 rounded-xl font-bold hover:bg-gray-100 hover:shadow-xl transition-all duration-300"
                                >
                                    <ShoppingBag size={19} />

                                    Shop Now

                                    <ArrowRight size={18} />
                                </Link>

                                <Link
                                    to="/products"
                                    className="inline-flex items-center justify-center border border-white/30 bg-white/10 backdrop-blur text-white px-6 py-3.5 rounded-xl font-bold hover:bg-white hover:text-gray-900 transition-all duration-300"
                                >
                                    View Products
                                </Link>

                            </div>

                            {/* Trust Info */}
                            <div className="flex flex-wrap justify-center lg:justify-start gap-6 mt-9">

                                <div>
                                    <p className="text-2xl font-bold text-white">
                                        100+
                                    </p>

                                    <p className="text-xs text-blue-200">
                                        Products
                                    </p>
                                </div>

                                <div className="w-px bg-white/20"></div>

                                <div>
                                    <p className="text-2xl font-bold text-white">
                                        4.9
                                    </p>

                                    <p className="text-xs text-blue-200">
                                        Customer Rating
                                    </p>
                                </div>

                                <div className="w-px bg-white/20"></div>

                                <div>
                                    <p className="text-2xl font-bold text-white">
                                        24/7
                                    </p>

                                    <p className="text-xs text-blue-200">
                                        Support
                                    </p>
                                </div>

                            </div>

                        </div>

                        {/* Right Side */}
                        <div className="relative flex justify-center items-center">

                            {/* Glow */}
                            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 bg-white/20 rounded-full blur-3xl"></div>

                            {/* Product Card */}
                            <div className="relative">

                                <div className="absolute -top-4 -right-4 z-20 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg rotate-6">
                                    New
                                </div>

                                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] p-5 shadow-2xl">

                                    <img
                                        src={img}
                                        alt="Latest smartphone"
                                        className="relative z-10 w-64 sm:w-72 lg:w-80 h-[330px] sm:h-[370px] lg:h-[400px] object-contain rounded-2xl drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                                    />

                                </div>

                                {/* Floating Price */}
                                <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-2xl px-5 py-3">

                                    <p className="text-xs text-gray-500">
                                        Starting from
                                    </p>

                                    <p className="text-xl font-extrabold text-gray-900">
                                        $399
                                    </p>

                                </div>

                                {/* Floating Rating */}
                                <div className="absolute top-10 -left-8 bg-white rounded-xl shadow-xl px-4 py-2 hidden sm:block">

                                    <div className="flex items-center gap-1">
                                        <span className="text-yellow-400">
                                            ★
                                        </span>

                                        <span className="font-bold text-gray-800">
                                            4.9
                                        </span>
                                    </div>

                                    <p className="text-[10px] text-gray-400">
                                        Customer Rating
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
}

export default Hero;