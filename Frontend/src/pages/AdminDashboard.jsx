
import React from "react";
import {
    ShoppingBag,
    Users,
    Package,
    DollarSign,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    MoreHorizontal,
    Clock3,
    CheckCircle2,
    Truck,
    XCircle,
    ChevronRight,
    BarChart3,
    CalendarDays,
    Bell,
    Search,
    Settings,
    UserRound,
    Sparkles,
    Menu,
    Activity,
} from "lucide-react";

const AdminDashboard = () => {
    const stats = [
        {
            title: "Total Revenue",
            value: "$24,780",
            change: "+18.4%",
            positive: true,
            icon: DollarSign,
            description: "vs last month",
        },
        {
            title: "Total Orders",
            value: "1,248",
            change: "+12.8%",
            positive: true,
            icon: ShoppingBag,
            description: "vs last month",
        },
        {
            title: "Total Products",
            value: "384",
            change: "+8.2%",
            positive: true,
            icon: Package,
            description: "new products",
        },
        {
            title: "Total Customers",
            value: "8,549",
            change: "-2.4%",
            positive: false,
            icon: Users,
            description: "vs last month",
        },
    ];

    const recentOrders = [
        {
            id: "#ORD-84921",
            customer: "Ahmed Khan",
            product: "Premium Sneakers",
            amount: "$129.00",
            status: "Delivered",
            date: "Oct 08, 2026",
        },
        {
            id: "#ORD-84920",
            customer: "Ali Raza",
            product: "Smart Watch Pro",
            amount: "$249.00",
            status: "Processing",
            date: "Oct 08, 2026",
        },
        {
            id: "#ORD-84919",
            customer: "Hassan Malik",
            product: "Wireless Headphones",
            amount: "$89.00",
            status: "Shipped",
            date: "Oct 07, 2026",
        },
        {
            id: "#ORD-84918",
            customer: "Usman Tariq",
            product: "Classic T-Shirt",
            amount: "$45.00",
            status: "Pending",
            date: "Oct 07, 2026",
        },
        {
            id: "#ORD-84917",
            customer: "Hamza Sheikh",
            product: "Leather Backpack",
            amount: "$119.00",
            status: "Cancelled",
            date: "Oct 06, 2026",
        },
    ];

    const topProducts = [
        {
            name: "Premium Sneakers",
            category: "Footwear",
            sold: 284,
            revenue: "$36,840",
            image:
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200",
        },
        {
            name: "Smart Watch Pro",
            category: "Electronics",
            sold: 216,
            revenue: "$29,160",
            image:
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200",
        },
        {
            name: "Wireless Headphones",
            category: "Electronics",
            sold: 189,
            revenue: "$16,821",
            image:
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200",
        },
        {
            name: "Leather Backpack",
            category: "Accessories",
            sold: 142,
            revenue: "$16,898",
            image:
                "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200",
        },
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case "Delivered":
                return "bg-emerald-400/10 text-emerald-300 border-emerald-400/20";
            case "Processing":
                return "bg-blue-400/10 text-blue-300 border-blue-400/20";
            case "Shipped":
                return "bg-violet-400/10 text-violet-300 border-violet-400/20";
            case "Pending":
                return "bg-amber-400/10 text-amber-300 border-amber-400/20";
            case "Cancelled":
                return "bg-red-400/10 text-red-300 border-red-400/20";
            default:
                return "bg-white/5 text-slate-300 border-white/10";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Delivered":
                return <CheckCircle2 size={13} />;
            case "Processing":
                return <Clock3 size={13} />;
            case "Shipped":
                return <Truck size={13} />;
            case "Pending":
                return <Clock3 size={13} />;
            case "Cancelled":
                return <XCircle size={13} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen overflow-hidden bg-[#070914] text-white">

            {/* =====================================================
                BACKGROUND GLOW
            ====================================================== */}

            <div className="pointer-events-none fixed inset-0 overflow-hidden">

                <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-[120px]" />

                <div className="absolute right-[-180px] top-[15%] h-[500px] w-[500px] rounded-full bg-indigo-600/15 blur-[130px]" />

                <div className="absolute bottom-[-200px] left-[35%] h-[500px] w-[500px] rounded-full bg-fuchsia-600/10 blur-[130px]" />

            </div>

            {/* =====================================================
                HEADER
            ====================================================== */}

            <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#070914]/70 backdrop-blur-2xl">

                <div className="flex h-[76px] items-center justify-between px-5 lg:px-8">

                    {/* LEFT */}

                    <div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">

                            <span>Admin</span>

                            <ChevronRight size={12} />

                            <span className="text-slate-300">
                                Dashboard
                            </span>

                        </div>

                        <h1 className="mt-1 text-lg font-bold tracking-tight text-white">
                            Dashboard Overview
                        </h1>
                    </div>

                    {/* RIGHT */}

                    <div className="flex items-center gap-2 sm:gap-3">

                        {/* SEARCH */}

                        <button className="hidden h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-slate-500 backdrop-blur-xl transition hover:border-white/20 hover:bg-white/[0.07] md:flex">

                            <Search size={16} />

                            <span>
                                Search...
                            </span>

                            <span className="ml-8 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] text-slate-500">
                                CTRL K
                            </span>

                        </button>

                        {/* MOBILE SEARCH */}

                        <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition hover:bg-white/[0.08] md:hidden">
                            <Search size={17} />
                        </button>

                        {/* NOTIFICATION */}

                        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 backdrop-blur-xl transition hover:bg-white/[0.08] hover:text-white">

                            <Bell size={17} />

                            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-violet-500 ring-2 ring-[#070914]" />

                        </button>

                        {/* PROFILE */}

                        <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-2 py-1.5 backdrop-blur-xl transition hover:bg-white/[0.08]">

                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-600/20">

                                <UserRound size={15} />

                            </div>

                            <div className="hidden text-left sm:block">

                                <p className="text-xs font-semibold text-white">
                                    Admin
                                </p>

                                <p className="text-[9px] text-slate-500">
                                    Administrator
                                </p>

                            </div>

                        </button>

                    </div>

                </div>

            </header>

            {/* =====================================================
                MAIN
            ====================================================== */}

            <main className="relative z-10 mx-auto max-w-[1600px] p-5 lg:p-8">

                {/* HERO */}

                <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

                    <div>

                        <div className="mb-3 flex items-center gap-2">

                            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-violet-400/20 bg-violet-500/10 text-violet-300">

                                <Sparkles size={13} />

                            </div>

                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-300">
                                Store Overview
                            </span>

                        </div>

                        <h2 className="text-3xl font-bold tracking-tight text-white lg:text-4xl">
                            Welcome back, Admin
                            <span className="ml-2">👋</span>
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            Here's what's happening with your store today.
                        </p>

                    </div>

                    {/* DATE */}

                    <button className="flex h-11 items-center gap-2 self-start rounded-xl border border-white/10 bg-white/[0.04] px-4 text-xs font-semibold text-slate-300 shadow-xl backdrop-blur-xl transition hover:border-violet-400/20 hover:bg-white/[0.07] lg:self-auto">

                        <CalendarDays
                            size={15}
                            className="text-violet-400"
                        />

                        Oct 01 - Oct 08

                        <ChevronRight size={14} />

                    </button>

                </div>

                {/* =====================================================
                    STATS
                ====================================================== */}

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    {stats.map((stat, index) => {

                        const Icon = stat.icon;

                        return (

                            <div
                                key={index}
                                className="group relative overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.045] p-5 shadow-2xl shadow-black/20 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-violet-400/20 hover:bg-white/[0.065]"
                            >

                                {/* CARD GLOW */}

                                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-violet-600/10 blur-3xl transition duration-500 group-hover:bg-violet-500/20" />

                                <div className="relative flex items-start justify-between">

                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-slate-300 shadow-inner transition duration-300 group-hover:border-violet-400/20 group-hover:bg-violet-500/10 group-hover:text-violet-300">

                                        <Icon size={19} />

                                    </div>

                                    <button className="text-slate-600 transition hover:text-slate-300">
                                        <MoreHorizontal size={18} />
                                    </button>

                                </div>

                                <div className="relative mt-5">

                                    <p className="text-xs font-medium text-slate-500">
                                        {stat.title}
                                    </p>

                                    <h3 className="mt-1 text-2xl font-bold tracking-tight text-white">
                                        {stat.value}
                                    </h3>

                                    <div className="mt-3 flex items-center gap-2">

                                        <span
                                            className={`flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-bold ${
                                                stat.positive
                                                    ? "border-emerald-400/10 bg-emerald-400/10 text-emerald-400"
                                                    : "border-red-400/10 bg-red-400/10 text-red-400"
                                            }`}
                                        >

                                            {stat.positive ? (
                                                <TrendingUp size={11} />
                                            ) : (
                                                <TrendingDown size={11} />
                                            )}

                                            {stat.change}

                                        </span>

                                        <span className="text-[10px] text-slate-600">
                                            {stat.description}
                                        </span>

                                    </div>

                                </div>

                            </div>

                        );
                    })}

                </div>

                {/* =====================================================
                    ANALYTICS
                ====================================================== */}

                <div className="mt-5 grid gap-5 xl:grid-cols-3">

                    {/* REVENUE */}

                    <div className="relative overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.045] p-5 shadow-2xl shadow-black/20 backdrop-blur-2xl xl:col-span-2">

                        <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-violet-600/10 blur-[80px]" />

                        <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                            <div>

                                <div className="flex items-center gap-2">

                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-violet-400/10 bg-violet-500/10 text-violet-300">
                                        <Activity size={14} />
                                    </div>

                                    <p className="text-xs font-semibold text-slate-400">
                                        Revenue Analytics
                                    </p>

                                </div>

                                <div className="mt-3 flex items-end gap-3">

                                    <h3 className="text-3xl font-bold text-white">
                                        $24,780
                                    </h3>

                                    <span className="mb-1 flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                                        <TrendingUp size={12} />
                                        18.4%
                                    </span>

                                </div>

                            </div>

                            <select className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-[10px] font-semibold text-slate-400 outline-none backdrop-blur-xl">
                                <option className="bg-[#111322]">
                                    Last 7 days
                                </option>
                                <option className="bg-[#111322]">
                                    Last 30 days
                                </option>
                                <option className="bg-[#111322]">
                                    Last 3 months
                                </option>
                            </select>

                        </div>

                        {/* CHART */}

                        <div className="relative mt-8 h-[250px]">

                            <div className="absolute inset-0 flex flex-col justify-between">

                                {[1, 2, 3, 4, 5].map((item) => (

                                    <div
                                        key={item}
                                        className="border-t border-dashed border-white/[0.06]"
                                    />

                                ))}

                            </div>

                            <svg
                                className="absolute inset-0 h-full w-full overflow-visible"
                                viewBox="0 0 800 250"
                                preserveAspectRatio="none"
                            >

                                <defs>

                                    <linearGradient
                                        id="revenueGradient"
                                        x1="0"
                                        x2="0"
                                        y1="0"
                                        y2="1"
                                    >

                                        <stop
                                            offset="0%"
                                            stopColor="#8b5cf6"
                                            stopOpacity="0.30"
                                        />

                                        <stop
                                            offset="100%"
                                            stopColor="#8b5cf6"
                                            stopOpacity="0"
                                        />

                                    </linearGradient>

                                </defs>

                                <path
                                    d="M0 210 C70 190 80 170 140 180 C200 190 210 130 270 145 C330 160 350 110 410 125 C470 140 490 70 550 95 C610 120 630 80 690 65 C740 52 770 35 800 45 L800 250 L0 250 Z"
                                    fill="url(#revenueGradient)"
                                />

                                <path
                                    d="M0 210 C70 190 80 170 140 180 C200 190 210 130 270 145 C330 160 350 110 410 125 C470 140 490 70 550 95 C610 120 630 80 690 65 C740 52 770 35 800 45"
                                    fill="none"
                                    stroke="#8b5cf6"
                                    strokeWidth="3"
                                />

                                <circle
                                    cx="800"
                                    cy="45"
                                    r="5"
                                    fill="#8b5cf6"
                                />

                                <circle
                                    cx="800"
                                    cy="45"
                                    r="10"
                                    fill="#8b5cf6"
                                    opacity="0.15"
                                />

                            </svg>

                            <div className="absolute bottom-[-25px] left-0 right-0 flex justify-between text-[9px] font-medium text-slate-600">

                                <span>Oct 02</span>
                                <span>Oct 03</span>
                                <span>Oct 04</span>
                                <span>Oct 05</span>
                                <span>Oct 06</span>
                                <span>Oct 07</span>
                                <span>Oct 08</span>

                            </div>

                        </div>

                    </div>

                    {/* ORDER SUMMARY */}

                    <div className="relative overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.045] p-5 shadow-2xl shadow-black/20 backdrop-blur-2xl">

                        <div className="pointer-events-none absolute right-[-40px] top-[-40px] h-32 w-32 rounded-full bg-violet-600/10 blur-3xl" />

                        <div className="relative flex items-center justify-between">

                            <div>

                                <p className="text-xs font-semibold text-slate-500">
                                    Order Summary
                                </p>

                                <h3 className="mt-1 text-xl font-bold text-white">
                                    1,248 Orders
                                </h3>

                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-500/10 text-violet-300">
                                <BarChart3 size={18} />
                            </div>

                        </div>

                        <div className="mt-7 flex items-center justify-center">

                            <div className="relative flex h-44 w-44 items-center justify-center rounded-full bg-[conic-gradient(#8b5cf6_0deg_216deg,#a78bfa_216deg_290deg,rgba(255,255,255,0.07)_290deg_360deg)] shadow-[0_0_50px_rgba(139,92,246,0.15)]">

                                <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full border border-white/[0.08] bg-[#0b0d1b]">

                                    <span className="text-2xl font-bold text-white">
                                        78%
                                    </span>

                                    <span className="text-[10px] text-slate-600">
                                        Completed
                                    </span>

                                </div>

                            </div>

                        </div>

                        <div className="mt-7 space-y-3">

                            {[
                                ["Delivered", "742", "bg-violet-500"],
                                ["Processing", "316", "bg-violet-300"],
                                ["Other", "190", "bg-slate-600"],
                            ].map(([label, value, color]) => (

                                <div
                                    key={label}
                                    className="flex items-center justify-between"
                                >

                                    <div className="flex items-center gap-2">

                                        <span
                                            className={`h-2 w-2 rounded-full ${color}`}
                                        />

                                        <span className="text-[11px] text-slate-500">
                                            {label}
                                        </span>

                                    </div>

                                    <span className="text-[11px] font-bold text-slate-300">
                                        {value}
                                    </span>

                                </div>

                            ))}

                        </div>

                    </div>

                </div>

                {/* =====================================================
                    ORDERS + PRODUCTS
                ====================================================== */}

                <div className="mt-5 grid gap-5 xl:grid-cols-3">

                    {/* RECENT ORDERS */}

                    <div className="overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.045] shadow-2xl shadow-black/20 backdrop-blur-2xl xl:col-span-2">

                        <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">

                            <div>

                                <div className="flex items-center gap-2">

                                    <h3 className="font-bold text-white">
                                        Recent Orders
                                    </h3>

                                    <span className="rounded-full border border-violet-400/10 bg-violet-500/10 px-2 py-0.5 text-[8px] font-bold text-violet-300">
                                        LIVE
                                    </span>

                                </div>

                                <p className="mt-1 text-[10px] text-slate-600">
                                    Latest customer transactions
                                </p>

                            </div>

                            <button className="flex items-center gap-1 text-[10px] font-bold text-violet-400 transition hover:text-violet-300">
                                View all
                                <ArrowUpRight size={13} />
                            </button>

                        </div>

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[720px]">

                                <thead>

                                    <tr className="border-b border-white/[0.06] bg-white/[0.015]">

                                        {[
                                            "Order",
                                            "Customer",
                                            "Product",
                                            "Amount",
                                            "Status",
                                        ].map((heading) => (

                                            <th
                                                key={heading}
                                                className="px-5 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-600"
                                            >
                                                {heading}
                                            </th>

                                        ))}

                                    </tr>

                                </thead>

                                <tbody>

                                    {recentOrders.map((order) => (

                                        <tr
                                            key={order.id}
                                            className="border-b border-white/[0.05] transition last:border-0 hover:bg-white/[0.025]"
                                        >

                                            <td className="px-5 py-4">

                                                <p className="text-[11px] font-bold text-slate-300">
                                                    {order.id}
                                                </p>

                                                <p className="mt-1 text-[9px] text-slate-600">
                                                    {order.date}
                                                </p>

                                            </td>

                                            <td className="px-5 py-4">

                                                <div className="flex items-center gap-2">

                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-violet-400/10 bg-violet-500/10 text-[9px] font-bold text-violet-300">

                                                        {order.customer
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")}

                                                    </div>

                                                    <span className="text-[11px] font-semibold text-slate-300">
                                                        {order.customer}
                                                    </span>

                                                </div>

                                            </td>

                                            <td className="px-5 py-4">

                                                <span className="text-[11px] text-slate-500">
                                                    {order.product}
                                                </span>

                                            </td>

                                            <td className="px-5 py-4">

                                                <span className="text-[11px] font-bold text-slate-300">
                                                    {order.amount}
                                                </span>

                                            </td>

                                            <td className="px-5 py-4">

                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold ${getStatusStyle(
                                                        order.status
                                                    )}`}
                                                >

                                                    {getStatusIcon(
                                                        order.status
                                                    )}

                                                    {order.status}

                                                </span>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    </div>

                    {/* TOP PRODUCTS */}

                    <div className="overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.045] shadow-2xl shadow-black/20 backdrop-blur-2xl">

                        <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">

                            <div>

                                <h3 className="font-bold text-white">
                                    Top Products
                                </h3>

                                <p className="mt-1 text-[10px] text-slate-600">
                                    Best selling products
                                </p>

                            </div>

                            <button className="text-slate-600 transition hover:text-slate-300">
                                <MoreHorizontal size={18} />
                            </button>

                        </div>

                        <div className="p-3">

                            {topProducts.map((product, index) => (

                                <div
                                    key={product.name}
                                    className="group flex items-center gap-3 rounded-xl p-3 transition hover:bg-white/[0.035]"
                                >

                                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5">

                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                                        />

                                    </div>

                                    <div className="min-w-0 flex-1">

                                        <p className="truncate text-[11px] font-bold text-slate-300">
                                            {product.name}
                                        </p>

                                        <p className="mt-1 text-[9px] text-slate-600">
                                            {product.category} •{" "}
                                            {product.sold} sold
                                        </p>

                                    </div>

                                    <div className="text-right">

                                        <p className="text-[11px] font-bold text-slate-300">
                                            {product.revenue}
                                        </p>

                                        <p className="mt-1 text-[9px] font-bold text-violet-400">
                                            #{index + 1}
                                        </p>

                                    </div>

                                </div>

                            ))}

                        </div>

                        <div className="border-t border-white/[0.07] p-4">

                            <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] py-2.5 text-[10px] font-bold text-slate-400 transition hover:border-violet-400/20 hover:bg-violet-500/10 hover:text-violet-300">

                                View all products

                                <ArrowUpRight size={13} />

                            </button>

                        </div>

                    </div>

                </div>

                {/* =====================================================
                    BOTTOM CARDS
                ====================================================== */}

                <div className="mt-5 grid gap-5 md:grid-cols-3">

                    {/* CONVERSION */}

                    <div className="group relative overflow-hidden rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-600/20 via-violet-500/10 to-indigo-600/10 p-6 shadow-2xl shadow-violet-950/20 backdrop-blur-2xl">

                        <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-violet-500/20 blur-[60px]" />

                        <div className="relative">

                            <div className="flex items-center justify-between">

                                <p className="text-xs font-medium text-violet-200">
                                    Conversion Rate
                                </p>

                                <TrendingUp
                                    size={17}
                                    className="text-violet-300"
                                />

                            </div>

                            <h3 className="mt-3 text-3xl font-bold text-white">
                                8.64%
                            </h3>

                            <p className="mt-2 text-[10px] text-violet-200/60">
                                +1.2% compared to last month
                            </p>

                            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">

                                <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-violet-400 to-indigo-400 shadow-lg shadow-violet-500/40" />

                            </div>

                        </div>

                    </div>

                    {/* INVENTORY */}

                    <div className="group rounded-2xl border border-white/[0.09] bg-white/[0.045] p-6 shadow-2xl shadow-black/20 backdrop-blur-2xl transition hover:border-amber-400/10">

                        <div className="flex items-center justify-between">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/10 bg-amber-400/10 text-amber-300">

                                <Package size={17} />

                            </div>

                            <span className="rounded-full border border-amber-400/10 bg-amber-400/10 px-2 py-1 text-[9px] font-bold text-amber-300">
                                Attention
                            </span>

                        </div>

                        <p className="mt-5 text-xs font-medium text-slate-500">
                            Low Stock Items
                        </p>

                        <h3 className="mt-1 text-2xl font-bold text-white">
                            24
                        </h3>

                        <button className="mt-4 flex items-center gap-1 text-[10px] font-bold text-violet-400 transition hover:text-violet-300">

                            Manage inventory

                            <ChevronRight size={12} />

                        </button>

                    </div>

                    {/* QUICK ACTIONS */}

                    <div className="rounded-2xl border border-white/[0.09] bg-white/[0.045] p-6 shadow-2xl shadow-black/20 backdrop-blur-2xl">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-xs font-bold text-white">
                                    Quick Actions
                                </p>

                                <p className="mt-1 text-[9px] text-slate-600">
                                    Manage your store faster
                                </p>

                            </div>

                            <Settings
                                size={17}
                                className="text-slate-600"
                            />

                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-2">

                            {[
                                "+ Add Product",
                                "+ Add Category",
                                "View Orders",
                                "Users",
                            ].map((action) => (

                                <button
                                    key={action}
                                    className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2.5 text-left text-[10px] font-semibold text-slate-400 transition hover:border-violet-400/20 hover:bg-violet-500/10 hover:text-violet-300"
                                >
                                    {action}
                                </button>

                            ))}

                        </div>

                    </div>

                </div>

                {/* FOOTER */}

                <div className="mt-8 border-t border-white/[0.06] pt-5 text-center">

                    <p className="text-[9px] text-slate-700">
                        © 2026 Admin Dashboard • E-Commerce Management System
                    </p>

                </div>

            </main>
        </div>
    );
};

export default AdminDashboard;
