
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";

import {
    Search,
    SlidersHorizontal,
    X,
    ChevronDown,
    ShoppingCart,
    Heart,
    Eye,
    Star,
    Sparkles,
    Package,
} from "lucide-react";

function ProductsComponenet() {
    const dispatch = useDispatch();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);
    const [categoryLoading, setCategoryLoading] =
        useState(true);

    // =========================
    // FILTER STATES
    // =========================

    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] =
        useState("all");
    const [priceFilter, setPriceFilter] =
        useState("all");
    const [stockFilter, setStockFilter] =
        useState("all");

    // =========================
    // FETCH PRODUCTS
    // =========================

    const fetchProducts = async () => {
        try {
            const response = await axios.get(
                "http://localhost:3000/api/products/all"
            );

            const data = response.data;

            if (data.success === true) {
                setProducts(data.products || []);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error(
                "Error fetching products:",
                error
            );

            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // ADD TO CART
    // =========================

    const handleAddToCart = (e, product) => {
        e.preventDefault();
        e.stopPropagation();

        if (Number(product.stock) <= 0) return;

        dispatch(addToCart(product));
    };

    // =========================
    // FETCH CATEGORIES
    // =========================

    const fetchCategories = async () => {
        try {
            setCategoryLoading(true);

            const response = await axios.get(
                "http://localhost:3000/api/categories/all"
            );

            if (Array.isArray(response.data)) {
                setCategories(response.data);
            } else if (
                Array.isArray(response.data.data)
            ) {
                setCategories(response.data.data);
            } else if (
                Array.isArray(response.data.categories)
            ) {
                setCategories(
                    response.data.categories
                );
            } else {
                setCategories([]);
            }
        } catch (error) {
            console.error(
                "Error fetching categories:",
                error
            );

            setCategories([]);
        } finally {
            setCategoryLoading(false);
        }
    };

    // =========================
    // FETCH DATA
    // =========================

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    // =========================
    // FILTER PRODUCTS
    // =========================

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            let productCategoryId = "";
            let productCategoryName = "";

            if (
                product.category &&
                typeof product.category === "object"
            ) {
                productCategoryId =
                    product.category._id || "";

                productCategoryName =
                    product.category.name || "";
            } else {
                productCategoryName =
                    product.category || "";
            }

            // SEARCH
            const searchText =
                search.toLowerCase().trim();

            const matchesSearch =
                !searchText ||
                product.name
                    ?.toLowerCase()
                    .includes(searchText) ||
                product.description
                    ?.toLowerCase()
                    .includes(searchText) ||
                productCategoryName
                    ?.toLowerCase()
                    .includes(searchText);

            // CATEGORY
            const matchesCategory =
                categoryFilter === "all" ||
                productCategoryId ===
                    categoryFilter ||
                productCategoryName ===
                    categoryFilter;

            // PRICE
            const price =
                Number(product.price) || 0;

            const discountPrice =
                Number(product.discountPrice) || 0;

            const finalPrice =
                discountPrice > 0
                    ? discountPrice
                    : price;

            let matchesPrice = true;

            if (priceFilter === "under50") {
                matchesPrice = finalPrice < 50;
            }

            if (priceFilter === "50to100") {
                matchesPrice =
                    finalPrice >= 50 &&
                    finalPrice <= 100;
            }

            if (priceFilter === "100to200") {
                matchesPrice =
                    finalPrice > 100 &&
                    finalPrice <= 200;
            }

            if (priceFilter === "above200") {
                matchesPrice =
                    finalPrice > 200;
            }

            // STOCK
            let matchesStock = true;

            if (stockFilter === "instock") {
                matchesStock =
                    Number(product.stock) > 0;
            }

            if (stockFilter === "outofstock") {
                matchesStock =
                    Number(product.stock) <= 0;
            }

            return (
                matchesSearch &&
                matchesCategory &&
                matchesPrice &&
                matchesStock
            );
        });
    }, [
        products,
        search,
        categoryFilter,
        priceFilter,
        stockFilter,
    ]);

    // =========================
    // CLEAR FILTERS
    // =========================

    const clearFilters = () => {
        setSearch("");
        setCategoryFilter("all");
        setPriceFilter("all");
        setStockFilter("all");
    };

    const hasFilters =
        search.trim() !== "" ||
        categoryFilter !== "all" ||
        priceFilter !== "all" ||
        stockFilter !== "all";

    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">

                    <div className="relative w-16 h-16 mx-auto">

                        <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>

                        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>

                    </div>

                    <p className="mt-5 text-gray-600 font-semibold">
                        Loading our collection...
                    </p>

                    <p className="text-sm text-gray-400 mt-1">
                        Please wait a moment
                    </p>

                </div>
            </div>
        );
    }

    return (
        <section className="relative min-h-screen overflow-hidden bg-slate-50 py-12 sm:py-16 px-4 sm:px-6 lg:px-10">

            {/* =========================================
                BACKGROUND DECORATIONS
            ========================================= */}

            <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl"></div>

            <div className="pointer-events-none absolute top-1/3 -right-40 w-[500px] h-[500px] bg-purple-300/15 rounded-full blur-3xl"></div>

            <div className="pointer-events-none absolute bottom-0 left-1/3 w-96 h-96 bg-cyan-300/10 rounded-full blur-3xl"></div>


            <div className="relative max-w-7xl mx-auto">

                {/* =========================================
                    PREMIUM HEADER
                ========================================= */}

                <div className="mb-10">

                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

                        <div>

                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-widest">

                                <Sparkles
                                    size={14}
                                />

                                Our Collection

                            </div>

                            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-900">

                                Discover{" "}

                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">

                                    Something Amazing

                                </span>

                            </h1>

                            <p className="mt-4 max-w-2xl text-gray-500 text-base sm:text-lg leading-7">

                                Explore our carefully selected
                                collection of premium products,
                                designed to bring quality and
                                style into your everyday life.

                            </p>

                        </div>


                        {/* PRODUCT COUNT */}

                        <div className="shrink-0">

                            <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/70 backdrop-blur-xl border border-white shadow-lg">

                                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">

                                    <Package
                                        size={21}
                                        className="text-blue-600"
                                    />

                                </div>

                                <div>

                                    <p className="text-2xl font-black text-gray-900">

                                        {
                                            filteredProducts.length
                                        }

                                    </p>

                                    <p className="text-xs text-gray-500 font-medium">

                                        Products Available

                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* =========================================
                    PREMIUM SEARCH & FILTER
                ========================================= */}

                <div className="relative mb-12">

                    <div className="absolute inset-0 bg-gradient-to-r from-blue-200/20 via-purple-200/10 to-cyan-200/20 blur-2xl"></div>

                    <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/65 backdrop-blur-2xl shadow-2xl shadow-gray-200/60 p-5 sm:p-6">

                        {/* SEARCH */}

                        <div className="flex flex-col lg:flex-row gap-4">

                            <div className="relative flex-1">

                                <Search
                                    size={21}
                                    className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type="text"
                                    placeholder="Search products, categories..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(
                                            e.target
                                                .value
                                        )
                                    }
                                    className="w-full h-14 pl-14 pr-12 rounded-2xl border border-gray-200/80 bg-white/80 text-gray-800 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
                                />

                                {search && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSearch(
                                                ""
                                            )
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition"
                                    >
                                        <X
                                            size={17}
                                        />
                                    </button>
                                )}

                            </div>

                            <button
                                type="button"
                                className="h-14 px-8 rounded-2xl bg-gray-900 text-white font-bold flex items-center justify-center gap-2 hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300"
                            >

                                <Search size={18} />

                                Search

                            </button>

                        </div>


                        {/* FILTER DIVIDER */}

                        <div className="my-6 border-t border-gray-200/70"></div>


                        {/* FILTER ROW */}

                        <div className="flex flex-col lg:flex-row gap-4">

                            {/* FILTER LABEL */}

                            <div className="flex items-center gap-3 shrink-0">

                                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">

                                    <SlidersHorizontal
                                        size={19}
                                        className="text-blue-600"
                                    />

                                </div>

                                <div>

                                    <p className="font-bold text-gray-800">
                                        Filter Products
                                    </p>

                                    <p className="text-xs text-gray-400">
                                        Refine your search
                                    </p>

                                </div>

                            </div>


                            {/* CATEGORY */}

                            <div className="relative flex-1">

                                <select
                                    value={
                                        categoryFilter
                                    }
                                    onChange={(e) =>
                                        setCategoryFilter(
                                            e.target
                                                .value
                                        )
                                    }
                                    disabled={
                                        categoryLoading
                                    }
                                    className="appearance-none w-full h-12 px-4 pr-11 rounded-xl border border-gray-200 bg-white/80 text-gray-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition cursor-pointer disabled:opacity-60"
                                >

                                    <option value="all">
                                        {categoryLoading
                                            ? "Loading Categories..."
                                            : "All Categories"}
                                    </option>

                                    {!categoryLoading &&
                                        categories.map(
                                            (
                                                category
                                            ) => (
                                                <option
                                                    key={
                                                        category._id
                                                    }
                                                    value={
                                                        category._id
                                                    }
                                                >
                                                    {
                                                        category.name
                                                    }
                                                </option>
                                            )
                                        )}

                                </select>

                                <ChevronDown
                                    size={17}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                />

                            </div>


                            {/* PRICE */}

                            <div className="relative flex-1">

                                <select
                                    value={
                                        priceFilter
                                    }
                                    onChange={(e) =>
                                        setPriceFilter(
                                            e.target
                                                .value
                                        )
                                    }
                                    className="appearance-none w-full h-12 px-4 pr-11 rounded-xl border border-gray-200 bg-white/80 text-gray-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition cursor-pointer"
                                >

                                    <option value="all">
                                        All Prices
                                    </option>

                                    <option value="under50">
                                        Under $50
                                    </option>

                                    <option value="50to100">
                                        $50 - $100
                                    </option>

                                    <option value="100to200">
                                        $100 - $200
                                    </option>

                                    <option value="above200">
                                        Above $200
                                    </option>

                                </select>

                                <ChevronDown
                                    size={17}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                />

                            </div>


                            {/* STOCK */}

                            <div className="relative flex-1">

                                <select
                                    value={
                                        stockFilter
                                    }
                                    onChange={(e) =>
                                        setStockFilter(
                                            e.target
                                                .value
                                        )
                                    }
                                    className="appearance-none w-full h-12 px-4 pr-11 rounded-xl border border-gray-200 bg-white/80 text-gray-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition cursor-pointer"
                                >

                                    <option value="all">
                                        All Products
                                    </option>

                                    <option value="instock">
                                        In Stock
                                    </option>

                                    <option value="outofstock">
                                        Out of Stock
                                    </option>

                                </select>

                                <ChevronDown
                                    size={17}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                />

                            </div>


                            {/* CLEAR */}

                            {hasFilters && (
                                <button
                                    type="button"
                                    onClick={
                                        clearFilters
                                    }
                                    className="h-12 px-5 rounded-xl border border-gray-200 bg-white text-gray-600 font-bold hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition flex items-center justify-center gap-2"
                                >

                                    <X size={16} />

                                    Clear

                                </button>
                            )}

                        </div>

                    </div>

                </div>


                {/* =========================================
                    RESULTS INFO
                ========================================= */}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">

                    <div>

                        <h2 className="text-xl font-bold text-gray-900">
                            Featured Products
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Showing{" "}
                            <span className="font-bold text-gray-800">
                                {
                                    filteredProducts.length
                                }
                            </span>{" "}
                            of{" "}
                            <span className="font-bold text-gray-800">
                                {products.length}
                            </span>{" "}
                            products
                        </p>

                    </div>

                    {hasFilters && (
                        <span className="inline-flex items-center gap-2 self-start sm:self-auto px-4 py-2 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-xs font-bold">

                            <SlidersHorizontal
                                size={14}
                            />

                            Filters Active

                        </span>
                    )}

                </div>


                {/* =========================================
                    PRODUCTS GRID
                ========================================= */}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                    {filteredProducts.length > 0 ? (

                        filteredProducts.map(
                            (product) => {

                                const price =
                                    Number(
                                        product.price
                                    ) || 0;

                                const discountPrice =
                                    Number(
                                        product.discountPrice
                                    ) || 0;

                                const actualPrice =
                                    discountPrice > 0
                                        ? discountPrice
                                        : price;

                                const discount =
                                    price > 0 &&
                                    discountPrice > 0 &&
                                    discountPrice <
                                        price
                                        ? Math.round(
                                              ((price -
                                                  discountPrice) /
                                                  price) *
                                                  100
                                          )
                                        : 0;

                                const productCategory =
                                    product.category &&
                                    typeof product.category ===
                                        "object"
                                        ? product
                                              .category
                                              .name
                                        : product.category;

                                const stock =
                                    Number(
                                        product.stock
                                    ) || 0;

                                return (
                                    <Link
                                        to={`/product/${product._id}`}
                                        key={
                                            product._id
                                        }
                                        className="group"
                                    >

                                        <div className="relative h-full bg-white/80 backdrop-blur-xl rounded-[1.75rem] overflow-hidden border border-white shadow-lg shadow-gray-200/50 hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-500 hover:-translate-y-2">

                                            {/* =================================
                                                IMAGE
                                            ================================= */}

                                            <div className="relative h-72 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">

                                                <img
                                                    src={
                                                        product.productImage
                                                    }
                                                    alt={
                                                        product.name
                                                    }
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                                />

                                                {/* IMAGE OVERLAY */}

                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>


                                                {/* DISCOUNT */}

                                                {discount >
                                                    0 && (
                                                    <div className="absolute top-4 left-4">

                                                        <span className="inline-flex items-center gap-1.5 bg-red-500 text-white text-xs font-black px-3.5 py-2 rounded-full shadow-lg">

                                                            <Sparkles
                                                                size={
                                                                    12
                                                                }
                                                            />

                                                            {
                                                                discount
                                                            }
                                                            % OFF

                                                        </span>

                                                    </div>
                                                )}


                                                {/* WISHLIST */}

                                                <button
                                                    type="button"
                                                    onClick={(
                                                        e
                                                    ) =>
                                                        e.preventDefault()
                                                    }
                                                    className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg"
                                                >

                                                    <Heart
                                                        size={
                                                            19
                                                        }
                                                    />

                                                </button>


                                                {/* QUICK VIEW */}

                                                <div className="absolute bottom-4 left-4 right-4 opacity-0 translate-y-5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">

                                                    <div className="bg-white/95 backdrop-blur-md text-gray-900 py-3 rounded-xl font-bold shadow-xl flex items-center justify-center gap-2">

                                                        <Eye
                                                            size={
                                                                17
                                                            }
                                                        />

                                                        Quick View

                                                    </div>

                                                </div>

                                            </div>


                                            {/* =================================
                                                PRODUCT INFO
                                            ================================= */}

                                            <div className="p-5">

                                                {/* CATEGORY */}

                                                <div className="flex items-center justify-between gap-2 mb-2">

                                                    <p className="text-[11px] uppercase tracking-widest text-blue-600 font-black truncate">

                                                        {productCategory ||
                                                            "Product"}

                                                    </p>

                                                    {stock >
                                                        0 && (
                                                        <span className="text-[10px] text-gray-400 font-semibold shrink-0">
                                                            {
                                                                stock
                                                            }{" "}
                                                            left
                                                        </span>
                                                    )}

                                                </div>


                                                {/* NAME */}

                                                <h3 className="text-lg font-extrabold text-gray-900 truncate group-hover:text-blue-600 transition-colors">

                                                    {
                                                        product.name
                                                    }

                                                </h3>


                                                {/* DESCRIPTION */}

                                                <p className="text-sm text-gray-500 mt-2 line-clamp-2 min-h-[40px] leading-5">

                                                    {
                                                        product.description
                                                    }

                                                </p>


                                                {/* RATING */}

                                                <div className="flex items-center gap-2 mt-4">

                                                    <div className="flex items-center gap-0.5">

                                                        {[
                                                            1,
                                                            2,
                                                            3,
                                                            4,
                                                            5,
                                                        ].map(
                                                            (
                                                                star
                                                            ) => (
                                                                <Star
                                                                    key={
                                                                        star
                                                                    }
                                                                    size={
                                                                        14
                                                                    }
                                                                    fill="currentColor"
                                                                    className="text-yellow-400"
                                                                />
                                                            )
                                                        )}

                                                    </div>

                                                    <span className="text-xs text-gray-400 font-medium">

                                                        (
                                                        {
                                                            product.numReviews ||
                                                            0
                                                        }{" "}
                                                        reviews)

                                                    </span>

                                                </div>


                                                {/* STOCK */}

                                                <div className="mt-4">

                                                    {stock >
                                                    0 ? (
                                                        <span className="inline-flex items-center gap-2 bg-green-50 text-green-600 border border-green-100 px-3 py-1.5 rounded-full text-xs font-bold">

                                                            <span className="relative flex w-2 h-2">

                                                                <span className="absolute inline-flex w-full h-full rounded-full bg-green-400 opacity-75 animate-ping"></span>

                                                                <span className="relative inline-flex w-2 h-2 rounded-full bg-green-500"></span>

                                                            </span>

                                                            In Stock

                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-2 bg-red-50 text-red-600 border border-red-100 px-3 py-1.5 rounded-full text-xs font-bold">

                                                            <span className="w-2 h-2 rounded-full bg-red-500"></span>

                                                            Out of Stock

                                                        </span>
                                                    )}

                                                </div>


                                                {/* PRICE */}

                                                <div className="flex items-end justify-between gap-2 mt-5">

                                                    <div>

                                                        <div className="flex items-center gap-2">

                                                            <span className="text-2xl font-black text-gray-900">

                                                                $
                                                                {actualPrice.toFixed(
                                                                    2
                                                                )}

                                                            </span>

                                                            {discount >
                                                                0 && (
                                                                <span className="text-sm text-gray-400 line-through">

                                                                    $
                                                                    {price.toFixed(
                                                                        2
                                                                    )}

                                                                </span>
                                                            )}

                                                        </div>

                                                        {discount >
                                                            0 && (
                                                            <p className="text-xs font-bold text-green-600 mt-1">

                                                                Save{" "}
                                                                {discount}
                                                                %

                                                            </p>
                                                        )}

                                                    </div>

                                                </div>


                                                {/* ADD TO CART */}

                                                <button
                                                    type="button"
                                                    onClick={(
                                                        e
                                                    ) =>
                                                        handleAddToCart(
                                                            e,
                                                            product
                                                        )
                                                    }
                                                    disabled={
                                                        stock <=
                                                        0
                                                    }
                                                    className={`group/cart relative overflow-hidden w-full mt-5 py-3.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                                                        stock >
                                                        0
                                                            ? "bg-gray-900 text-white hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-0.5"
                                                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                    }`}
                                                >

                                                    {stock >
                                                    0 ? (
                                                        <>
                                                            <ShoppingCart
                                                                size={
                                                                    18
                                                                }
                                                                className="transition-transform group-hover/cart:scale-110"
                                                            />

                                                            Add to Cart
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Package
                                                                size={
                                                                    18
                                                                }
                                                            />

                                                            Out of Stock
                                                        </>
                                                    )}

                                                </button>

                                            </div>

                                        </div>

                                    </Link>
                                );
                            }
                        )

                    ) : (

                        /* =================================
                           EMPTY STATE
                        ================================= */

                        <div className="col-span-full">

                            <div className="relative overflow-hidden rounded-[2rem] bg-white/70 backdrop-blur-xl border border-white shadow-xl py-20 px-6 text-center">

                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-60 h-60 bg-blue-100/40 rounded-full blur-3xl"></div>

                                <div className="relative">

                                    <div className="w-20 h-20 mx-auto rounded-3xl bg-blue-50 flex items-center justify-center">

                                        <Search
                                            size={34}
                                            className="text-blue-500"
                                        />

                                    </div>

                                    <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-6">

                                        No Products Found

                                    </h2>

                                    <p className="text-gray-500 mt-2 max-w-md mx-auto">

                                        We couldn't find
                                        any products
                                        matching your
                                        current search
                                        or filters.

                                    </p>

                                    {hasFilters && (
                                        <button
                                            type="button"
                                            onClick={
                                                clearFilters
                                            }
                                            className="mt-6 px-7 py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-blue-600 transition-all shadow-lg"
                                        >

                                            Clear All Filters

                                        </button>
                                    )}

                                </div>

                            </div>

                        </div>

                    )}

                </div>

            </div>

        </section>
    );
}

export default ProductsComponenet;
