
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
    FolderOpen,
    ArrowUpRight,
    ArrowRight,
    RefreshCw,
    AlertCircle,
    Sparkles,
} from "lucide-react";

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                "http://localhost:3000/api/categories/all"
            );

            console.log("Categories:", response.data);

            if (Array.isArray(response.data)) {
                setCategories(response.data);
            } else if (Array.isArray(response.data.data)) {
                setCategories(response.data.data);
            } else if (Array.isArray(response.data.categories)) {
                setCategories(response.data.categories);
            } else {
                setCategories([]);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load categories. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    /* =========================
       LOADING UI
    ========================= */
    if (loading) {
        return (
            <section className="bg-slate-50 py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    <div className="mb-14 text-center">
                        <div className="mx-auto h-6 w-36 animate-pulse rounded-full bg-slate-200" />

                        <div className="mx-auto mt-4 h-10 w-72 animate-pulse rounded-xl bg-slate-200" />

                        <div className="mx-auto mt-4 h-4 w-full max-w-xl animate-pulse rounded bg-slate-200" />
                    </div>

                    <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="overflow-hidden rounded-3xl bg-white shadow-sm"
                            >
                                <div className="h-64 animate-pulse bg-slate-200" />

                                <div className="space-y-4 p-6">
                                    <div className="h-6 w-32 animate-pulse rounded bg-slate-200" />
                                    <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                                    <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    /* =========================
       ERROR UI
    ========================= */
    if (error) {
        return (
            <section className="flex min-h-[500px] items-center justify-center bg-slate-50 px-4 py-20">
                <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-xl">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
                        <AlertCircle className="h-8 w-8 text-red-500" />
                    </div>

                    <h2 className="mt-6 text-2xl font-bold text-slate-900">
                        Unable to Load Categories
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                        {error}
                    </p>

                    <button
                        onClick={fetchCategories}
                        className="mt-7 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-blue-600 hover:shadow-lg"
                    >
                        <RefreshCw size={17} />
                        Try Again
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="relative overflow-hidden bg-slate-50 py-20">

            {/* Background Decoration */}
            <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />

            <div className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-purple-200/30 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* =========================
                    SECTION HEADER
                ========================= */}
                <div className="mb-14">

                    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

                        {/* LEFT CONTENT */}
                        <div>

                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 shadow-sm">
                                <Sparkles className="h-4 w-4 text-blue-600" />

                                <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                                    Shop By Category
                                </span>
                            </div>

                            <h2 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                                Explore Our{" "}
                                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    Categories
                                </span>
                            </h2>

                            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
                                Discover carefully selected categories and find exactly what
                                you're looking for.
                            </p>

                            <div className="mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600" />

                        </div>

                        {/* =========================
                            SEE MORE BUTTON
                        ========================= */}
                        {categories.length > 4 && (
                            <Link
                                to="/categories"
                                className="group inline-flex w-fit items-center gap-3 self-start rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-800 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:shadow-lg sm:self-auto"
                            >

                                <span>
                                    See More Categories
                                </span>

                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 transition-all duration-300 group-hover:bg-blue-600">

                                    <ArrowRight
                                        className="h-4 w-4 text-slate-600 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white"
                                    />

                                </span>

                            </Link>
                        )}

                    </div>

                </div>

                {/* =========================
                    EMPTY STATE
                ========================= */}
                {categories.length === 0 ? (

                    <div className="rounded-3xl border border-slate-100 bg-white px-6 py-20 text-center shadow-sm">

                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100">
                            <FolderOpen className="h-10 w-10 text-slate-400" />
                        </div>

                        <h3 className="mt-6 text-2xl font-bold text-slate-900">
                            No Categories Found
                        </h3>

                        <p className="mx-auto mt-3 max-w-md text-slate-500">
                            There are currently no categories available in the store.
                        </p>

                    </div>

                ) : (

                    /* =========================
                        CATEGORY GRID
                    ========================= */
                    <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                        {/* ONLY FIRST 4 CATEGORIES */}
                        {categories.slice(0, 4).map((category) => (

                            <Link
                                to={`/category/${category._id}`}
                                key={category._id}
                                className="group relative overflow-hidden rounded-3xl border border-white/30 bg-white/10 shadow-xl backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:bg-white/20 hover:shadow-2xl"
                            >

                                {/* IMAGE */}
                                <div className="relative h-64 overflow-hidden">

                                    {category.CategoryImage ? (

                                        <img
                                            src={category.CategoryImage}
                                            alt={category.name}
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />

                                    ) : (

                                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-200 via-indigo-200 to-purple-200">

                                            <FolderOpen className="h-20 w-20 text-blue-500" />

                                        </div>

                                    )}

                                    {/* IMAGE OVERLAY */}
                                    <div className="absolute inset-0 bg-black/20 transition-all duration-500 group-hover:bg-black/10" />

                                    {/* ACTIVE BADGE */}
                                    {category.isActive !== false && (

                                        <div className="absolute left-4 top-4">

                                            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-3 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur-xl">

                                                <span className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.9)]" />

                                                Active

                                            </span>

                                        </div>

                                    )}

                                </div>

                                {/* GLASS DETAILS */}
                                <div className="relative border-t border-white/30 bg-white/20 p-6 backdrop-blur-xl">

                                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/5" />

                                    <div className="relative">

                                        {/* NAME + ARROW */}
                                        <div className="flex items-start justify-between gap-4">

                                            <div className="min-w-0">

                                                <h3 className="truncate text-xl font-extrabold capitalize text-slate-900 transition-colors duration-300 group-hover:text-blue-700">
                                                    {category.name}
                                                </h3>

                                                <p className="mt-1 text-sm font-medium text-slate-600">
                                                    Explore products
                                                </p>

                                            </div>

                                            {/* GLASS ARROW */}
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/30 shadow-lg backdrop-blur-xl transition-all duration-300 group-hover:bg-blue-600/80">

                                                <ArrowUpRight
                                                    className="h-5 w-5 text-slate-700 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                                                />

                                            </div>

                                        </div>

                                        {/* DESCRIPTION */}
                                        <div className="mt-4 min-h-[48px]">

                                            {category.description ? (

                                                <p className="line-clamp-2 text-sm leading-6 text-slate-600">
                                                    {category.description}
                                                </p>

                                            ) : (

                                                <p className="text-sm leading-6 text-slate-500">
                                                    Discover products from this category.
                                                </p>

                                            )}

                                        </div>

                                        {/* DIVIDER */}
                                        <div className="my-5 border-t border-white/40" />

                                        {/* BOTTOM */}
                                        <div className="flex items-center justify-between">

                                            <span className="text-sm font-bold text-slate-800 transition-colors group-hover:text-blue-700">
                                                View Products
                                            </span>

                                            <span className="flex items-center gap-1 text-sm font-semibold text-blue-700">

                                                Explore

                                                <ArrowRight
                                                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                                                />

                                            </span>

                                        </div>

                                    </div>

                                </div>

                            </Link>

                        ))}

                    </div>

                )}

            </div>

        </section>
    );
};

export default Category;
