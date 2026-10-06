import React from "react";
import { Link } from "react-router-dom";
import {
    Home,
    ShoppingBag,
    ArrowLeft,
    Search,
    Sparkles,
} from "lucide-react";

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center px-6 py-12 overflow-hidden relative">

            {/* Background Glow */}
            <div className="absolute top-[-150px] left-[-150px] w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-3xl" />
            <div className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-3xl" />

            {/* Decorative Blur Circles */}
            <div className="absolute top-20 right-[15%] w-3 h-3 bg-indigo-400 rounded-full animate-pulse" />
            <div className="absolute bottom-28 left-[15%] w-2 h-2 bg-purple-400 rounded-full animate-pulse" />

            {/* Main Card */}
            <div className="relative z-10 max-w-3xl w-full">

                <div className="
                    relative
                    overflow-hidden
                    rounded-3xl
                    border border-white/10
                    bg-white/[0.06]
                    backdrop-blur-2xl
                    shadow-2xl
                    shadow-black/40
                    px-6 sm:px-10 md:px-16
                    py-12 md:py-16
                    text-center
                ">

                    {/* Top Sparkle */}
                    <div className="flex justify-center mb-6">
                        <div className="
                            flex items-center gap-2
                            px-4 py-2
                            rounded-full
                            border border-indigo-400/20
                            bg-indigo-500/10
                            text-indigo-300
                            text-sm font-medium
                        ">
                            <Sparkles size={16} />
                            <span>Oops! Something went wrong</span>
                        </div>
                    </div>

                    {/* 404 */}
                    <div className="relative select-none">

                        <h1 className="
                            text-[110px]
                            sm:text-[150px]
                            md:text-[190px]
                            leading-none
                            font-black
                            tracking-tighter
                            bg-gradient-to-r
                            from-indigo-400
                            via-purple-400
                            to-pink-400
                            bg-clip-text
                            text-transparent
                            drop-shadow-2xl
                        ">
                            404
                        </h1>

                        {/* Small floating search icon */}
                        <div className="
                            absolute
                            top-0
                            right-[12%]
                            sm:right-[20%]
                            w-12 h-12
                            rounded-2xl
                            bg-white/10
                            border border-white/10
                            backdrop-blur-xl
                            flex items-center justify-center
                            text-indigo-300
                            rotate-12
                            shadow-xl
                        ">
                            <Search size={22} />
                        </div>
                    </div>

                    {/* Heading */}
                    <h2 className="
                        mt-5
                        text-2xl sm:text-3xl md:text-4xl
                        font-bold
                        text-white
                    ">
                        Page Not Found
                    </h2>

                    {/* Description */}
                    <p className="
                        mt-4
                        max-w-xl
                        mx-auto
                        text-slate-400
                        text-sm sm:text-base
                        leading-7
                    ">
                        The page you're looking for doesn't exist or may have
                        been moved. Don't worry, let's get you back to something
                        useful.
                    </p>

                    {/* Buttons */}
                    <div className="
                        mt-8
                        flex
                        flex-col
                        sm:flex-row
                        justify-center
                        gap-3
                    ">

                        {/* Home */}
                        <Link
                            to="/"
                            className="
                                group
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                px-6
                                py-3.5
                                rounded-xl
                                bg-gradient-to-r
                                from-indigo-500
                                to-purple-600
                                text-white
                                font-semibold
                                shadow-lg
                                shadow-indigo-500/20
                                hover:shadow-indigo-500/40
                                hover:-translate-y-0.5
                                transition-all
                                duration-300
                            "
                        >
                            <Home size={18} />

                            <span>Back to Home</span>

                            <ArrowLeft
                                size={17}
                                className="
                                    rotate-180
                                    group-hover:translate-x-1
                                    transition-transform
                                "
                            />
                        </Link>

                        {/* Products */}
                        <Link
                            to="/products"
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                px-6
                                py-3.5
                                rounded-xl
                                border
                                border-white/10
                                bg-white/5
                                text-white
                                font-semibold
                                backdrop-blur-xl
                                hover:bg-white/10
                                hover:border-indigo-400/30
                                hover:-translate-y-0.5
                                transition-all
                                duration-300
                            "
                        >
                            <ShoppingBag size={18} />

                            <span>Explore Products</span>
                        </Link>
                    </div>

                    {/* Bottom Message */}
                    <div className="
                        mt-10
                        pt-6
                        border-t border-white/10
                        text-xs
                        text-slate-500
                    ">
                        Error 404 • The requested page could not be found
                    </div>

                </div>
            </div>
        </div>
    );
};

export default NotFound;
