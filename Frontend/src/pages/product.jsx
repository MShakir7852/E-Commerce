
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ShoppingCart, Check } from "lucide-react";
import { toast } from "sonner";

function Product() {
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [selectedColor, setSelectedColor] = useState("yellow");
    const [selectedSize, setSelectedSize] = useState("M");
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState("");
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [added, setAdded] = useState(false);

    // -----------------------------
    // Fetch Product
    // -----------------------------
    const fetchProduct = async () => {
        try {
            const response = await axios.get(
                `http://localhost:3000/api/products/${id}`
            );

            const fetchedProduct = response.data.product;

            setProduct(fetchedProduct);
            setSelectedImage(fetchedProduct.productImage);
        } catch (error) {
            console.error("Error fetching product:", error);

            toast.error("Unable to load product");
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [id]);

    // -----------------------------
    // Quantity
    // -----------------------------
    const increaseQuantity = () => {
        if (!product) return;

        if (quantity < Number(product.stock)) {
            setQuantity((prev) => prev + 1);
        } else {
            toast.warning(
                `Only ${product.stock} items are available in stock`
            );
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };

    // -----------------------------
    // Add To Cart
    // -----------------------------
    const addToCart = () => {
        if (!product) {
            toast.error("Product not found");
            return;
        }

        const stock = Number(product.stock) || 0;

        if (stock <= 0) {
            toast.error("This product is out of stock");
            return;
        }

        if (quantity > stock) {
            toast.error(`Only ${stock} items are available in stock`);
            return;
        }

        const productId = product._id || product.id;

        const price = Number(product.price) || 0;

        const discountPrice =
            Number(product.discountPrice) || price;

        const cartItem = {
            productId: productId,
            name: product.name,
            image: product.productImage,
            price: discountPrice,
            originalPrice: price,
            quantity: quantity,
            color: selectedColor,
            size: selectedSize,
        };

        try {
            const existingCart =
                JSON.parse(localStorage.getItem("cart")) || [];

            // Find same product + same color + same size
            const existingItemIndex = existingCart.findIndex(
                (item) =>
                    item.productId === cartItem.productId &&
                    item.color === cartItem.color &&
                    item.size === cartItem.size
            );

            // -----------------------------
            // Existing Item
            // -----------------------------
            if (existingItemIndex !== -1) {
                const existingQuantity =
                    Number(
                        existingCart[existingItemIndex].quantity
                    ) || 0;

                const newQuantity =
                    existingQuantity + quantity;

                // Check stock
                if (newQuantity > stock) {
                    toast.error(
                        `Only ${stock} items are available in stock`
                    );

                    return;
                }

                existingCart[existingItemIndex] = {
                    ...existingCart[existingItemIndex],
                    name: product.name,
                    image: product.productImage,
                    price: discountPrice,
                    originalPrice: price,
                    quantity: newQuantity,
                };

                toast.success("Cart quantity updated", {
                    description: `${product.name} • ${selectedColor} • ${selectedSize}`,
                });
            }

            // -----------------------------
            // New Item
            // -----------------------------
            else {
                existingCart.push(cartItem);

                toast.success("Product added to cart", {
                    description: `${product.name} • ${selectedColor} • ${selectedSize}`,
                });
            }

            // Save Cart
            localStorage.setItem(
                "cart",
                JSON.stringify(existingCart)
            );

            // Notify Navbar / Cart component
            window.dispatchEvent(
                new Event("cartUpdated")
            );

            // Button success state
            setAdded(true);

            setTimeout(() => {
                setAdded(false);
            }, 2000);

        } catch (error) {
            console.error(
                "Add to cart error:",
                error
            );

            toast.error(
                "Something went wrong while adding to cart"
            );
        }
    };

    // -----------------------------
    // Loading
    // -----------------------------
    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>

                    <p className="text-gray-600 font-medium">
                        Loading product...
                    </p>
                </div>
            </div>
        );
    }

    const price = Number(product.price) || 0;

    const discountPrice =
        Number(product.discountPrice) || price;

    const discountPercentage =
        price > 0
            ? Math.round(
                  ((price - discountPrice) / price) * 100
              )
            : 0;

    // -----------------------------
    // Theme
    // -----------------------------
    const theme = {
        yellow: {
            card: "bg-yellow-50",
            border: "border-yellow-200",
            accent: "text-yellow-600",
            button: "bg-yellow-500 hover:bg-yellow-600",
            light: "bg-yellow-100",
        },

        blue: {
            card: "bg-blue-50",
            border: "border-blue-200",
            accent: "text-blue-600",
            button: "bg-blue-600 hover:bg-blue-700",
            light: "bg-blue-100",
        },

        red: {
            card: "bg-red-50",
            border: "border-red-200",
            accent: "text-red-600",
            button: "bg-red-600 hover:bg-red-700",
            light: "bg-red-100",
        },

        green: {
            card: "bg-green-50",
            border: "border-green-200",
            accent: "text-green-600",
            button: "bg-green-600 hover:bg-green-700",
            light: "bg-green-100",
        },
    };

    const currentTheme = theme[selectedColor];

    return (
        <div className="min-h-screen bg-gray-100 py-6 sm:py-10 px-3 sm:px-6 lg:px-10">

            {/* Main Product Card */}
            <div
                className={`
                    max-w-7xl mx-auto
                    ${currentTheme.card}
                    ${currentTheme.border}
                    border
                    rounded-3xl
                    shadow-xl
                    overflow-hidden
                    transition-all
                    duration-500
                `}
            >

                {/* Top Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 p-5 sm:p-8 lg:p-12">

                    {/* LEFT - PRODUCT IMAGE */}
                    <div>

                        {/* Image Area */}
                        <div className="relative bg-white rounded-3xl p-4 sm:p-8 shadow-sm border border-gray-100">

                            {/* Discount Badge */}
                            {discountPercentage > 0 && (
                                <div className="absolute top-5 left-5 z-10">
                                    <span className="bg-red-500 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                                        {discountPercentage}% OFF
                                    </span>
                                </div>
                            )}

                            {/* Wishlist */}
                            <button
                                onClick={() =>
                                    setIsWishlisted(
                                        !isWishlisted
                                    )
                                }
                                className="
                                    absolute
                                    top-5
                                    right-5
                                    z-10
                                    w-11
                                    h-11
                                    rounded-full
                                    bg-white
                                    shadow-md
                                    flex
                                    items-center
                                    justify-center
                                    hover:scale-110
                                    transition
                                "
                            >
                                <span
                                    className={`text-2xl ${
                                        isWishlisted
                                            ? "text-red-500"
                                            : "text-gray-400"
                                    }`}
                                >
                                    {isWishlisted
                                        ? "♥"
                                        : "♡"}
                                </span>
                            </button>

                            {/* Main Image */}
                            <div className="h-full sm:h-[450px] flex items-center justify-center">
                                <img
                                    src={
                                        selectedImage ||
                                        product.productImage
                                    }
                                    alt={product.name}
                                    className="
                                        h-full
                                        max-w-full
                                        object-contain
                                        rounded-2xl
                                        transition
                                        duration-500
                                        hover:scale-105
                                    "
                                />
                            </div>
                        </div>

                        {/* Image Thumbnails */}
                        <div className="flex gap-3 mt-5 overflow-x-auto pb-2">

                            {[1, 2, 3, 4].map(
                                (item) => (
                                    <button
                                        key={item}
                                        onClick={() =>
                                            setSelectedImage(
                                                product.productImage
                                            )
                                        }
                                        className={`
                                            min-w-[75px]
                                            h-[75px]
                                            sm:w-[90px]
                                            sm:h-[90px]
                                            bg-white
                                            rounded-xl
                                            border-2
                                            p-2
                                            transition
                                            ${
                                                selectedImage ===
                                                product.productImage
                                                    ? "border-blue-500 shadow-md"
                                                    : "border-gray-200 hover:border-gray-400"
                                            }
                                        `}
                                    >
                                        <img
                                            src={
                                                product.productImage
                                            }
                                            alt={
                                                product.name
                                            }
                                            className="w-full h-full object-contain rounded-lg"
                                        />
                                    </button>
                                )
                            )}

                        </div>
                    </div>

                    {/* RIGHT - PRODUCT INFO */}
                    <div className="flex flex-col justify-center">

                        {/* Category */}
                        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            {product.category ||
                                "Premium Collection"}
                        </span>

                        {/* Product Name */}
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                            {product.name}
                        </h1>

                        {/* Rating */}
                        <div className="flex items-center gap-3 mt-4">

                            <div className="flex text-yellow-400 text-xl">
                                ★★★★★
                            </div>

                            <span className="text-sm text-gray-500">
                                {product.numReviews ||
                                    0}{" "}
                                Reviews
                            </span>

                        </div>

                        {/* Description */}
                        <p className="text-gray-600 leading-7 mt-5 text-sm sm:text-base text-justify">
                            {product.description}
                        </p>

                        {/* Price */}
                        <div className="flex items-center gap-4 mt-6">

                            <span
                                className={`text-3xl sm:text-4xl font-extrabold ${currentTheme.accent}`}
                            >
                                $
                                {discountPrice.toFixed(
                                    2
                                )}
                            </span>

                            {discountPrice < price && (
                                <span className="text-lg text-gray-400 line-through">
                                    ${price.toFixed(2)}
                                </span>
                            )}

                        </div>

                        {/* Save Amount */}
                        {discountPrice < price && (
                            <div className="mt-2">
                                <span className="inline-flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                                    You save $
                                    {(
                                        price -
                                        discountPrice
                                    ).toFixed(2)}
                                </span>
                            </div>
                        )}

                        {/* Divider */}
                        <div className="border-t border-gray-200 my-6"></div>

                        {/* COLOR */}
                        <div>

                            <div className="flex items-center gap-2 mb-3">

                                <span className="font-bold text-gray-800">
                                    Color:
                                </span>

                                <span className="text-gray-500 capitalize">
                                    {selectedColor}
                                </span>

                            </div>

                            <div className="flex gap-4">

                                <button
                                    onClick={() =>
                                        setSelectedColor(
                                            "yellow"
                                        )
                                    }
                                    className={`
                                        w-10
                                        h-10
                                        rounded-full
                                        bg-yellow-400
                                        border-4
                                        transition
                                        hover:scale-110
                                        ${
                                            selectedColor ===
                                            "yellow"
                                                ? "border-gray-900 scale-110 shadow-lg"
                                                : "border-white"
                                        }
                                    `}
                                    aria-label="Yellow"
                                />

                                <button
                                    onClick={() =>
                                        setSelectedColor(
                                            "blue"
                                        )
                                    }
                                    className={`
                                        w-10
                                        h-10
                                        rounded-full
                                        bg-blue-500
                                        border-4
                                        transition
                                        hover:scale-110
                                        ${
                                            selectedColor ===
                                            "blue"
                                                ? "border-gray-900 scale-110 shadow-lg"
                                                : "border-white"
                                        }
                                    `}
                                    aria-label="Blue"
                                />

                                <button
                                    onClick={() =>
                                        setSelectedColor(
                                            "red"
                                        )
                                    }
                                    className={`
                                        w-10
                                        h-10
                                        rounded-full
                                        bg-red-500
                                        border-4
                                        transition
                                        hover:scale-110
                                        ${
                                            selectedColor ===
                                            "red"
                                                ? "border-gray-900 scale-110 shadow-lg"
                                                : "border-white"
                                        }
                                    `}
                                    aria-label="Red"
                                />

                                <button
                                    onClick={() =>
                                        setSelectedColor(
                                            "green"
                                        )
                                    }
                                    className={`
                                        w-10
                                        h-10
                                        rounded-full
                                        bg-green-500
                                        border-4
                                        transition
                                        hover:scale-110
                                        ${
                                            selectedColor ===
                                            "green"
                                                ? "border-gray-900 scale-110 shadow-lg"
                                                : "border-white"
                                        }
                                    `}
                                    aria-label="Green"
                                />

                            </div>
                        </div>

                        {/* SIZE */}
                        <div className="mt-6">

                            <div className="flex items-center justify-between mb-3">

                                <span className="font-bold text-gray-800">
                                    Select Size
                                </span>

                                <button className="text-sm text-gray-500 underline hover:text-gray-900">
                                    Size Guide
                                </button>

                            </div>

                            <div className="flex gap-3 flex-wrap">

                                {[
                                    "S",
                                    "M",
                                    "L",
                                    "XL",
                                ].map(
                                    (size) => (
                                        <button
                                            key={
                                                size
                                            }
                                            onClick={() =>
                                                setSelectedSize(
                                                    size
                                                )
                                            }
                                            className={`
                                                w-14
                                                h-12
                                                rounded-xl
                                                border
                                                font-bold
                                                transition-all
                                                ${
                                                    selectedSize ===
                                                    size
                                                        ? `${currentTheme.button} text-white border-transparent shadow-md scale-105`
                                                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-600"
                                                }
                                            `}
                                        >
                                            {
                                                size
                                            }
                                        </button>
                                    )
                                )}

                            </div>
                        </div>

                        {/* STOCK */}
                        <div className="mt-6">

                            {product.stock > 0 ? (
                                <div className="flex items-center gap-2 text-green-600">

                                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>

                                    <span className="font-semibold">
                                        In Stock
                                    </span>

                                    <span className="text-gray-500 text-sm">
                                        (
                                        {
                                            product.stock
                                        }{" "}
                                        available)
                                    </span>

                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-red-600">

                                    <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>

                                    <span className="font-semibold">
                                        Out of Stock
                                    </span>

                                </div>
                            )}

                        </div>

                        {/* QUANTITY */}
                        <div className="mt-6">

                            <span className="font-bold text-gray-800 block mb-3">
                                Quantity
                            </span>

                            <div className="flex items-center">

                                <button
                                    onClick={
                                        decreaseQuantity
                                    }
                                    disabled={
                                        quantity <=
                                        1
                                    }
                                    className="
                                        w-11
                                        h-11
                                        rounded-l-xl
                                        border
                                        border-gray-300
                                        bg-white
                                        text-xl
                                        font-bold
                                        hover:bg-gray-100
                                        disabled:opacity-40
                                    "
                                >
                                    −
                                </button>

                                <div
                                    className="
                                    w-14
                                    h-11
                                    flex
                                    items-center
                                    justify-center
                                    bg-white
                                    border-t
                                    border-b
                                    border-gray-300
                                    font-bold
                                "
                                >
                                    {quantity}
                                </div>

                                <button
                                    onClick={
                                        increaseQuantity
                                    }
                                    disabled={
                                        !product.stock ||
                                        quantity >=
                                            Number(
                                                product.stock
                                            )
                                    }
                                    className="
                                        w-11
                                        h-11
                                        rounded-r-xl
                                        border
                                        border-gray-300
                                        bg-white
                                        text-xl
                                        font-bold
                                        hover:bg-gray-100
                                        disabled:opacity-40
                                    "
                                >
                                    +
                                </button>

                            </div>

                        </div>

                        {/* ADD TO CART */}
                        <button
                            onClick={addToCart}
                            disabled={!product.stock}
                            className={`
                                group
                                relative
                                w-full
                                mt-7
                                py-4
                                rounded-2xl
                                text-white
                                font-bold
                                text-lg
                                shadow-lg
                                transition-all
                                duration-300
                                flex
                                items-center
                                justify-center
                                gap-3
                                overflow-hidden
                                ${
                                    product.stock
                                        ? `${currentTheme.button} hover:scale-[1.02] hover:shadow-xl`
                                        : "bg-gray-400 cursor-not-allowed"
                                }
                            `}
                        >

                            {/* Shine Effect */}
                            {product.stock &&
                                !added && (
                                    <span
                                        className="
                                            absolute
                                            inset-0
                                            -translate-x-full
                                            bg-gradient-to-r
                                            from-transparent
                                            via-white/20
                                            to-transparent
                                            transition-transform
                                            duration-700
                                            group-hover:translate-x-full
                                        "
                                    />
                                )}

                            {added ? (
                                <>
                                    <Check className="h-6 w-6" />
                                    Added to Cart
                                </>
                            ) : product.stock ? (
                                <>
                                    <ShoppingCart className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
                                    Add to Cart
                                </>
                            ) : (
                                <>
                                    <ShoppingCart className="h-6 w-6" />
                                    Out of Stock
                                </>
                            )}

                        </button>

                        {/* Selected Options */}
                        <div className="mt-5 p-4 bg-white/70 rounded-2xl border border-gray-200">

                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">
                                    Selected Color
                                </span>

                                <span className="font-bold capitalize">
                                    {selectedColor}
                                </span>
                            </div>

                            <div className="flex justify-between text-sm mt-2">
                                <span className="text-gray-500">
                                    Selected Size
                                </span>

                                <span className="font-bold">
                                    {selectedSize}
                                </span>
                            </div>

                            <div className="flex justify-between text-sm mt-2">
                                <span className="text-gray-500">
                                    Quantity
                                </span>

                                <span className="font-bold">
                                    {quantity}
                                </span>
                            </div>

                        </div>

                    </div>
                </div>

                {/* PRODUCT INFORMATION */}
                <div className="border-t border-gray-200 bg-white/60 p-6 sm:p-8 lg:p-12">

                    <div className="max-w-5xl mx-auto">

                        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                            Product Details
                        </h2>

                        <div className="w-16 h-1 bg-blue-600 rounded-full mt-3 mb-6"></div>

                        <p className="text-gray-600 leading-8 text-justify">
                            {product.description}
                        </p>

                        {/* Product Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">

                            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                                <div className="text-2xl mb-2">
                                    🚚
                                </div>

                                <h3 className="font-bold text-gray-900">
                                    Fast Delivery
                                </h3>

                                <p className="text-sm text-gray-500 mt-1">
                                    Quick and reliable delivery.
                                </p>
                            </div>

                            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                                <div className="text-2xl mb-2">
                                    🔒
                                </div>

                                <h3 className="font-bold text-gray-900">
                                    Secure Payment
                                </h3>

                                <p className="text-sm text-gray-500 mt-1">
                                    Safe and secure checkout.
                                </p>
                            </div>

                            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                                <div className="text-2xl mb-2">
                                    ↩️
                                </div>

                                <h3 className="font-bold text-gray-900">
                                    Easy Returns
                                </h3>

                                <p className="text-sm text-gray-500 mt-1">
                                    Simple return experience.
                                </p>
                            </div>

                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}

export default Product;
