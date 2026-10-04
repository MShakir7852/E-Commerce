import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
    Search,
    SlidersHorizontal,
    X,
    ChevronDown,
} from "lucide-react";

function ProductsComponenet() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);
    const [categoryLoading, setCategoryLoading] = useState(true);

    // =========================
    // SEARCH & FILTER STATES
    // =========================

    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [priceFilter, setPriceFilter] = useState("all");
    const [stockFilter, setStockFilter] = useState("all");

    // =========================
    // FETCH PRODUCTS
    // =========================

    const fetchProducts = async () => {
        try {
            const response = await axios.get(
                "http://localhost:3000/api/products/all"
            );

            const data = response.data;

            console.log("Products:", data);

            if (data.success === true) {
                setProducts(data.products || []);
            } else {
                console.error(
                    "Failed to fetch products:",
                    data.message
                );

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
    // FETCH CATEGORIES
    // =========================

    const fetchCategories = async () => {
        try {
            setCategoryLoading(true);

            const response = await axios.get(
                "http://localhost:3000/api/categories/all"
            );

            console.log("Categories:", response.data);

            if (Array.isArray(response.data)) {
                setCategories(response.data);
            } else if (
                Array.isArray(response.data.data)
            ) {
                setCategories(response.data.data);
            } else if (
                Array.isArray(response.data.categories)
            ) {
                setCategories(response.data.categories);
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
    // FETCH BOTH
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

            // =================================
            // PRODUCT CATEGORY INFORMATION
            // =================================

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

            // =================================
            // SEARCH
            // =================================

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

            // =================================
            // CATEGORY
            // =================================

            const matchesCategory =
                categoryFilter === "all" ||
                productCategoryId === categoryFilter ||
                productCategoryName === categoryFilter;

            // =================================
            // PRICE
            // =================================

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
                matchesPrice = finalPrice > 200;
            }

            // =================================
            // STOCK
            // =================================

            let matchesStock = true;

            if (stockFilter === "instock") {
                matchesStock =
                    Number(product.stock) > 0;
            }

            if (stockFilter === "outofstock") {
                matchesStock =
                    Number(product.stock) <= 0;
            }

            // =================================
            // FINAL RESULT
            // =================================

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

    // =========================
    // CHECK ACTIVE FILTERS
    // =========================

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
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">

                    <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>

                    <p className="mt-4 text-gray-600 font-medium">
                        Loading products...
                    </p>

                </div>
            </div>
        );
    }

    return (
        <section className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-12">

            {/* =========================================
                HEADER
            ========================================= */}

            <div className="max-w-7xl mx-auto mb-8">

                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">

                    <div>

                        <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest">
                            Our Collection
                        </p>

                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                            Featured Products
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Discover our latest products at the best prices.
                        </p>

                    </div>

                    <span className="text-sm text-gray-500">
                        Showing{" "}
                        <span className="font-semibold text-gray-900">
                            {filteredProducts.length}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-gray-900">
                            {products.length}
                        </span>{" "}
                        Products
                    </span>

                </div>

            </div>


            {/* =========================================
                SEARCH & FILTER BOX
            ========================================= */}

            <div className="max-w-7xl mx-auto mb-10">

                <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/70 backdrop-blur-xl shadow-xl shadow-gray-200/50 p-5">

                    {/* Background Decoration */}

                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-200/20 rounded-full blur-3xl"></div>

                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-200/20 rounded-full blur-3xl"></div>


                    <div className="relative">

                        {/* =================================
                            SEARCH
                        ================================= */}

                        <div className="flex flex-col lg:flex-row gap-4">

                            <div className="relative flex-1">

                                <Search
                                    size={20}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type="text"
                                    placeholder="Search products, categories..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                    className="w-full h-12 pl-12 pr-12 rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                />

                                {search && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSearch("")
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition"
                                    >
                                        <X size={18} />
                                    </button>
                                )}

                            </div>

                            <button
                                type="button"
                                className="h-12 px-7 rounded-2xl bg-gray-900 text-white font-semibold flex items-center justify-center gap-2 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
                            >
                                <Search size={18} />

                                Search
                            </button>

                        </div>


                        {/* =================================
                            FILTERS
                        ================================= */}

                        <div className="mt-5 pt-5 border-t border-gray-200/70">

                            <div className="flex flex-col lg:flex-row lg:items-center gap-4">


                                {/* FILTER TITLE */}

                                <div className="flex items-center gap-2 text-gray-700 font-semibold shrink-0">

                                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">

                                        <SlidersHorizontal
                                            size={18}
                                            className="text-blue-600"
                                        />

                                    </div>

                                    <span>
                                        Filters
                                    </span>

                                </div>


                                {/* =================================
                                    CATEGORY FILTER
                                ================================= */}

                                <div className="relative flex-1">

                                    <select
                                        value={categoryFilter}
                                        onChange={(e) =>
                                            setCategoryFilter(
                                                e.target.value
                                            )
                                        }
                                        disabled={categoryLoading}
                                        className="appearance-none w-full h-11 px-4 pr-10 rounded-xl border border-gray-200 bg-white/80 text-gray-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                                    >

                                        <option value="all">
                                            {categoryLoading
                                                ? "Loading Categories..."
                                                : "All Categories"}
                                        </option>


                                        {!categoryLoading &&
                                            categories.map(
                                                (category) => (
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


                                {/* =================================
                                    PRICE FILTER
                                ================================= */}

                                <div className="relative flex-1">

                                    <select
                                        value={priceFilter}
                                        onChange={(e) =>
                                            setPriceFilter(
                                                e.target.value
                                            )
                                        }
                                        className="appearance-none w-full h-11 px-4 pr-10 rounded-xl border border-gray-200 bg-white/80 text-gray-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition cursor-pointer"
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


                                {/* =================================
                                    STOCK FILTER
                                ================================= */}

                                <div className="relative flex-1">

                                    <select
                                        value={stockFilter}
                                        onChange={(e) =>
                                            setStockFilter(
                                                e.target.value
                                            )
                                        }
                                        className="appearance-none w-full h-11 px-4 pr-10 rounded-xl border border-gray-200 bg-white/80 text-gray-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition cursor-pointer"
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


                                {/* =================================
                                    CLEAR FILTER
                                ================================= */}

                                {hasFilters && (
                                    <button
                                        type="button"
                                        onClick={
                                            clearFilters
                                        }
                                        className="h-11 px-5 rounded-xl border border-gray-200 bg-white text-gray-600 font-semibold hover:border-red-200 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center gap-2"
                                    >

                                        <X size={16} />

                                        Clear

                                    </button>
                                )}

                            </div>

                        </div>

                    </div>
                </div>

            </div>


            {/* =========================================
                PRODUCTS
            ========================================= */}

            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">

                {filteredProducts.length > 0 ? (

                    filteredProducts.map((product) => {

                        const price =
                            Number(product.price) || 0;

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
                            discountPrice > 0
                                ? Math.round(
                                      ((price -
                                          discountPrice) /
                                          price) *
                                          100
                                  )
                                : 0;

                        // Category display
                        const productCategory =
                            product.category &&
                            typeof product.category ===
                                "object"
                                ? product.category.name
                                : product.category;

                        return (
                            <Link
                                to={`/product/${product._id}`}
                                key={product._id}
                                className="group"
                            >

                                <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">

                                    {/* =================================
                                        IMAGE
                                    ================================= */}

                                    <div className="relative h-72 bg-gray-100 overflow-hidden">

                                        <img
                                            src={
                                                product.productImage
                                            }
                                            alt={
                                                product.name
                                            }
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />


                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-500"></div>


                                        {/* DISCOUNT */}

                                        {discount > 0 && (
                                            <div className="absolute top-4 left-4">

                                                <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">

                                                    {discount}% OFF

                                                </span>

                                            </div>
                                        )}


                                        {/* WISHLIST */}

                                        <button
                                            type="button"
                                            onClick={(e) =>
                                                e.preventDefault()
                                            }
                                            className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 hover:scale-110 transition-all shadow-md"
                                        >
                                            ♥
                                        </button>


                                        {/* QUICK VIEW */}

                                        <div className="absolute bottom-4 left-4 right-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">

                                            <div className="bg-white/95 backdrop-blur text-gray-900 text-center py-2.5 rounded-xl font-semibold shadow-lg">

                                                Quick View

                                            </div>

                                        </div>

                                    </div>


                                    {/* =================================
                                        PRODUCT INFO
                                    ================================= */}

                                    <div className="p-5">


                                        {/* CATEGORY */}

                                        <p className="text-xs uppercase tracking-wider text-blue-600 font-semibold mb-2">

                                            {productCategory ||
                                                "Product"}

                                        </p>


                                        {/* NAME */}

                                        <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition">

                                            {product.name}

                                        </h3>


                                        {/* DESCRIPTION */}

                                        <p className="text-sm text-gray-500 mt-2 line-clamp-2 min-h-[40px]">

                                            {
                                                product.description
                                            }

                                        </p>


                                        {/* RATING */}

                                        <div className="flex items-center gap-2 mt-4">

                                            <div className="flex text-yellow-400 text-sm">

                                                ★★★★★

                                            </div>

                                            <span className="text-xs text-gray-500">

                                                (
                                                {
                                                    product.numReviews ||
                                                    0
                                                }{" "}
                                                Reviews)

                                            </span>

                                        </div>


                                        {/* STOCK */}

                                        <div className="mt-4">

                                            {Number(
                                                product.stock
                                            ) > 0 ? (

                                                <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-600 border border-green-200 px-3 py-1 rounded-full text-xs font-semibold">

                                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>

                                                    In Stock

                                                </span>

                                            ) : (

                                                <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded-full text-xs font-semibold">

                                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>

                                                    Out of Stock

                                                </span>

                                            )}

                                        </div>


                                        {/* PRICE */}

                                        <div className="flex items-center justify-between mt-5">

                                            <div className="flex items-center gap-2">

                                                <span className="text-2xl font-bold text-gray-900">

                                                    $
                                                    {actualPrice.toFixed(
                                                        2
                                                    )}

                                                </span>


                                                {price >
                                                    discountPrice &&
                                                    discountPrice >
                                                        0 && (

                                                        <span className="text-sm text-gray-400 line-through">

                                                            $
                                                            {price.toFixed(
                                                                2
                                                            )}

                                                        </span>
                                                    )}

                                            </div>


                                            {discount > 0 && (

                                                <span className="text-xs font-semibold text-green-600">

                                                    Save{" "}
                                                    {
                                                        discount
                                                    }
                                                    %

                                                </span>

                                            )}

                                        </div>


                                        {/* ADD TO CART */}

                                        <button
                                            type="button"
                                            disabled={
                                                Number(
                                                    product.stock
                                                ) <= 0
                                            }
                                            onClick={(e) =>
                                                e.preventDefault()
                                            }
                                            className={`w-full mt-5 py-3 rounded-xl font-semibold transition-all duration-300 ${
                                                Number(
                                                    product.stock
                                                ) > 0
                                                    ? "bg-gray-900 text-white hover:bg-blue-600 hover:shadow-lg"
                                                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            }`}
                                        >

                                            {Number(
                                                product.stock
                                            ) > 0
                                                ? "Add to Cart"
                                                : "Out of Stock"}

                                        </button>

                                    </div>

                                </div>

                            </Link>
                        );
                    })

                ) : (

                    /* =================================
                       NO PRODUCTS
                    ================================= */

                    <div className="col-span-full text-center py-20">

                        <div className="text-5xl mb-4">
                            🛍️
                        </div>

                        <h2 className="text-2xl font-bold text-gray-800">
                            No Products Found
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Try changing your search or filters.
                        </p>

                        {hasFilters && (
                            <button
                                type="button"
                                onClick={
                                    clearFilters
                                }
                                className="mt-5 px-6 py-2.5 rounded-xl bg-gray-900 text-white font-semibold hover:bg-blue-600 transition"
                            >
                                Clear Filters
                            </button>
                        )}

                    </div>

                )}

            </div>

        </section>
    );
}

export default ProductsComponenet;