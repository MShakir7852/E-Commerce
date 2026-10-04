import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function ProductsComponenet() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(
                "http://localhost:3000/api/products/all"
            );

            const data = response.data;

            if (data.success === true) {
                setProducts(data.products);
            } else {
                console.error("Failed to fetch products:", data.message);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
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

            {/* Header */}
            <div className="max-w-7xl mx-auto mb-10">
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
                        {products.length} Products
                    </span>

                </div>
            </div>

            {/* Products */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">

                {products.length > 0 ? (
                    products.map((product) => {

                        const price = Number(product.price) || 0;
                        const discountPrice =
                            Number(product.discountPrice) || 0;

                        const discount =
                            price > 0
                                ? Math.round(
                                      ((price - discountPrice) / price) * 100
                                  )
                                : 0;

                        return (
                            <Link
                                to={`/product/${product._id}`}
                                key={product._id}
                                className="group"
                            >
                                <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">

                                    {/* Image Section */}
                                    <div className="relative h-72 bg-gray-100 overflow-hidden">

                                        <img
                                            src={product.productImage}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />

                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-500"></div>

                                        {/* Discount Badge */}
                                        {discount > 0 && (
                                            <div className="absolute top-4 left-4">
                                                <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                                                    {discount}% OFF
                                                </span>
                                            </div>
                                        )}

                                        {/* Wishlist */}
                                        <button
                                            onClick={(e) => e.preventDefault()}
                                            className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 hover:scale-110 transition-all shadow-md"
                                        >
                                            ♥
                                        </button>

                                        {/* Quick View */}
                                        <div className="absolute bottom-4 left-4 right-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                            <div className="bg-white/95 backdrop-blur text-gray-900 text-center py-2.5 rounded-xl font-semibold shadow-lg">
                                                Quick View
                                            </div>
                                        </div>
                                    </div>

                                    {/* Product Information */}
                                    <div className="p-5">

                                        {/* Category */}
                                        <p className="text-xs uppercase tracking-wider text-blue-600 font-semibold mb-2">
                                            {product.category || "Product"}
                                        </p>

                                        {/* Product Name */}
                                        <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition">
                                            {product.name}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-sm text-gray-500 mt-2 line-clamp-2 min-h-[40px]">
                                            {product.description}
                                        </p>

                                        {/* Rating */}
                                        <div className="flex items-center gap-2 mt-4">
                                            <div className="flex text-yellow-400 text-sm">
                                                ★★★★★
                                            </div>

                                            <span className="text-xs text-gray-500">
                                                ({product.numReviews || 0} Reviews)
                                            </span>
                                        </div>

                                        {/* Stock */}
                                        <div className="mt-4">
                                            {product.stock > 0 ? (
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

                                        {/* Price */}
                                        <div className="flex items-center justify-between mt-5">

                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl font-bold text-gray-900">
                                                    ${discountPrice.toFixed(2)}
                                                </span>

                                                {price > discountPrice && (
                                                    <span className="text-sm text-gray-400 line-through">
                                                        ${price.toFixed(2)}
                                                    </span>
                                                )}
                                            </div>

                                            {discount > 0 && (
                                                <span className="text-xs font-semibold text-green-600">
                                                    Save {discount}%
                                                </span>
                                            )}

                                        </div>

                                        {/* Add To Cart */}
                                        <button
                                            disabled={product.stock <= 0}
                                            onClick={(e) => e.preventDefault()}
                                            className={`w-full mt-5 py-3 rounded-xl font-semibold transition-all duration-300 ${
                                                product.stock > 0
                                                    ? "bg-gray-900 text-white hover:bg-blue-600 hover:shadow-lg"
                                                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            }`}
                                        >
                                            {product.stock > 0
                                                ? "Add to Cart"
                                                : "Out of Stock"}
                                        </button>

                                    </div>
                                </div>
                            </Link>
                        );
                    })
                ) : (
                    <div className="col-span-full text-center py-20">
                        <div className="text-5xl mb-4">🛍️</div>

                        <h2 className="text-2xl font-bold text-gray-800">
                            No Products Found
                        </h2>

                        <p className="text-gray-500 mt-2">
                            There are currently no products available.
                        </p>
                    </div>
                )}

            </div>
        </section>
    );
}

export default ProductsComponenet;