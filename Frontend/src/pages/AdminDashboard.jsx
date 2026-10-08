import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

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
    Activity,
    RefreshCw,
} from "lucide-react";

const AdminDashboard = () => {
    // =========================================================
    // STATES
    // =========================================================

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    // =========================================================
    // FETCH DASHBOARD
    // =========================================================

    const fetchDashboard = async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const accessToken =
                localStorage.getItem("accessToken");

            const response = await axios.get(
                "http://localhost:3000/api/admin/dashboard",
                {
                    headers: accessToken
                        ? {
                              Authorization: `Bearer ${accessToken}`,
                          }
                        : {},
                    withCredentials: true,
                }
            );

            if (
                response.data?.statusText ===
                "success"
            ) {
                setDashboard(
                    response.data.data
                );
            } else {
                throw new Error(
                    response.data?.message ||
                        "Failed to load dashboard"
                );
            }
        } catch (error) {
            console.error(
                "Admin Dashboard Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                    error.message ||
                    "Failed to load dashboard"
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // =========================================================
    // INITIAL LOAD + AUTO REFRESH
    // =========================================================

    useEffect(() => {
        fetchDashboard();

        const interval = setInterval(() => {
            fetchDashboard(true);
        }, 60000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    // =========================================================
    // SAFE DATA
    // =========================================================

    const statsData = dashboard?.stats || {
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalCustomers: 0,
    };

    const recentOrders =
        dashboard?.recentOrders || [];

    const topProducts =
        dashboard?.topProducts || [];

    const orderSummary =
        dashboard?.orderSummary || [];

    const revenueChart =
        dashboard?.revenueChart || [];

    const lowStockProducts =
        dashboard?.lowStockProducts || [];

    // =========================================================
    // ORDER SUMMARY
    // =========================================================

    const summaryMap = useMemo(() => {
        return orderSummary.reduce(
            (acc, item) => {
                const status =
                    item?._id || "Other";

                acc[status] =
                    (acc[status] || 0) +
                    Number(item?.count || 0);

                return acc;
            },
            {}
        );
    }, [orderSummary]);

    const deliveredOrders =
        summaryMap.Delivered || 0;

    const processingOrders =
        summaryMap.Processing || 0;

    const shippedOrders =
        summaryMap.Shipped || 0;

    const pendingOrders =
        summaryMap.Pending || 0;

    const cancelledOrders =
        summaryMap.Cancelled || 0;

    const completedPercentage =
        statsData.totalOrders > 0
            ? Math.round(
                  (deliveredOrders /
                      statsData.totalOrders) *
                      100
              )
            : 0;

    // =========================================================
    // OTHER ORDERS
    // =========================================================

    const otherOrders = Math.max(
        0,
        Number(statsData.totalOrders || 0) -
            deliveredOrders -
            processingOrders -
            shippedOrders -
            pendingOrders -
            cancelledOrders
    );

    // =========================================================
    // REVENUE CHART
    // =========================================================

    const chartValues = revenueChart.map(
        (item) => Number(item?.revenue || 0)
    );

    const maxRevenue = Math.max(
        ...chartValues,
        1
    );

    const chartPoints = revenueChart
        .map((item, index) => {
            const x =
                revenueChart.length === 1
                    ? 400
                    : (index /
                          (revenueChart.length -
                              1)) *
                      800;

            const revenue = Number(
                item?.revenue || 0
            );

            const y =
                220 -
                (revenue / maxRevenue) *
                    180;

            return {
                x,
                y,
                revenue,
                date: item?._id,
            };
        });

    const chartLinePath =
        chartPoints.length > 0
            ? chartPoints
                  .map(
                      (point, index) =>
                          `${index === 0 ? "M" : "L"} ${
                              point.x
                          } ${point.y}`
                  )
                  .join(" ")
            : "M0 220 L800 220";

    const chartAreaPath =
        chartPoints.length > 0
            ? `${chartLinePath} L800 250 L0 250 Z`
            : "M0 220 L800 220 L800 250 L0 250 Z";

    const latestRevenue =
        chartPoints.length > 0
            ? chartPoints[
                  chartPoints.length - 1
              ].revenue
            : 0;

    // =========================================================
    // DATE RANGE
    // =========================================================

    const dateRange = useMemo(() => {
        const end = new Date();

        const start = new Date();
        start.setDate(
            start.getDate() - 6
        );

        const formatDate = (date) =>
            date.toLocaleDateString(
                "en-US",
                {
                    month: "short",
                    day: "2-digit",
                }
            );

        return `${formatDate(
            start
        )} - ${formatDate(end)}`;
    }, []);

    // =========================================================
    // STATUS STYLE
    // =========================================================

    const getStatusStyle = (status) => {
        const normalized =
            String(status || "")
                .toLowerCase();

        switch (normalized) {
            case "delivered":
            case "completed":
                return "bg-emerald-400/10 text-emerald-300 border-emerald-400/20";

            case "processing":
                return "bg-blue-400/10 text-blue-300 border-blue-400/20";

            case "shipped":
                return "bg-violet-400/10 text-violet-300 border-violet-400/20";

            case "pending":
                return "bg-amber-400/10 text-amber-300 border-amber-400/20";

            case "cancelled":
            case "canceled":
                return "bg-red-400/10 text-red-300 border-red-400/20";

            default:
                return "bg-white/5 text-slate-300 border-white/10";
        }
    };

    // =========================================================
    // STATUS ICON
    // =========================================================

    const getStatusIcon = (status) => {
        const normalized =
            String(status || "")
                .toLowerCase();

        switch (normalized) {
            case "delivered":
            case "completed":
                return (
                    <CheckCircle2 size={13} />
                );

            case "processing":
                return (
                    <Clock3 size={13} />
                );

            case "shipped":
                return <Truck size={13} />;

            case "pending":
                return (
                    <Clock3 size={13} />
                );

            case "cancelled":
            case "canceled":
                return <XCircle size={13} />;

            default:
                return null;
        }
    };

    // =========================================================
    // FORMAT CURRENCY
    // =========================================================

    const formatCurrency = (value) => {
        return `$${Number(
            value || 0
        ).toLocaleString("en-US", {
            maximumFractionDigits: 0,
        })}`;
    };

    // =========================================================
    // STATS
    // =========================================================

    const stats = [
        {
            title: "Total Revenue",
            value: formatCurrency(
                statsData.totalRevenue
            ),
            change: "+18.4%",
            positive: true,
            icon: DollarSign,
            description: "all-time revenue",
        },
        {
            title: "Total Orders",
            value: Number(
                statsData.totalOrders || 0
            ).toLocaleString(),
            change: "+12.8%",
            positive: true,
            icon: ShoppingBag,
            description: "all orders",
        },
        {
            title: "Total Products",
            value: Number(
                statsData.totalProducts || 0
            ).toLocaleString(),
            change: "+8.2%",
            positive: true,
            icon: Package,
            description: "store products",
        },
        {
            title: "Total Customers",
            value: Number(
                statsData.totalCustomers || 0
            ).toLocaleString(),
            change: "",
            positive: true,
            icon: Users,
            description: "registered users",
        },
    ];

    // =========================================================
    // LOADING SCREEN
    // =========================================================

    if (loading) {
        return (
            <div className="min-h-screen bg-[#070914] text-white">
                <div className="pointer-events-none fixed inset-0 overflow-hidden">
                    <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-[120px]" />

                    <div className="absolute right-[-180px] top-[15%] h-[500px] w-[500px] rounded-full bg-indigo-600/15 blur-[130px]" />
                </div>

                <div className="relative z-10 flex min-h-screen items-center justify-center">
                    <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-10 py-9 text-center shadow-2xl backdrop-blur-2xl">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10">
                            <RefreshCw
                                size={24}
                                className="animate-spin text-violet-400"
                            />
                        </div>

                        <h2 className="mt-5 text-lg font-bold text-white">
                            Loading Dashboard
                        </h2>

                        <p className="mt-2 text-xs text-slate-500">
                            Fetching your store analytics...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // =========================================================
    // ERROR SCREEN
    // =========================================================

    if (error) {
        return (
            <div className="min-h-screen bg-[#070914] text-white">
                <div className="pointer-events-none fixed inset-0 overflow-hidden">
                    <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-[120px]" />

                    <div className="absolute right-[-180px] top-[15%] h-[500px] w-[500px] rounded-full bg-indigo-600/15 blur-[130px]" />
                </div>

                <div className="relative z-10 flex min-h-screen items-center justify-center px-5">
                    <div className="w-full max-w-md rounded-3xl border border-red-400/10 bg-white/[0.04] p-8 text-center shadow-2xl backdrop-blur-2xl">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10 text-red-400">
                            <XCircle size={25} />
                        </div>

                        <h2 className="mt-5 text-lg font-bold text-white">
                            Dashboard Failed
                        </h2>

                        <p className="mt-2 text-xs leading-5 text-slate-500">
                            {error}
                        </p>

                        <button
                            onClick={() =>
                                fetchDashboard()
                            }
                            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-violet-400/20 bg-violet-500/10 px-5 py-3 text-xs font-bold text-violet-300 transition hover:bg-violet-500/20"
                        >
                            <RefreshCw size={14} />

                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // =========================================================
    // UI
    // =========================================================

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

                        {/* REFRESH */}

                        <button
                            onClick={() =>
                                fetchDashboard(true)
                            }
                            disabled={refreshing}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 backdrop-blur-xl transition hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                            title="Refresh dashboard"
                        >
                            <RefreshCw
                                size={16}
                                className={
                                    refreshing
                                        ? "animate-spin"
                                        : ""
                                }
                            />
                        </button>

                        {/* NOTIFICATION */}

                        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 backdrop-blur-xl transition hover:bg-white/[0.08] hover:text-white">
                            <Bell size={17} />

                            {lowStockProducts.length >
                                0 && (
                                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-violet-500 ring-2 ring-[#070914]" />
                            )}
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
                            <span className="ml-2">
                                👋
                            </span>
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            Here's what's happening
                            with your store today.
                        </p>

                    </div>

                    {/* DATE */}

                    <button className="flex h-11 items-center gap-2 self-start rounded-xl border border-white/10 bg-white/[0.04] px-4 text-xs font-semibold text-slate-300 shadow-xl backdrop-blur-xl transition hover:border-violet-400/20 hover:bg-white/[0.07] lg:self-auto">

                        <CalendarDays
                            size={15}
                            className="text-violet-400"
                        />

                        {dateRange}

                        <ChevronRight size={14} />

                    </button>

                </div>

                {/* =====================================================
                    STATS
                ====================================================== */}

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    {stats.map(
                        (stat, index) => {
                            const Icon =
                                stat.icon;

                            return (
                                <div
                                    key={index}
                                    className="group relative overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.045] p-5 shadow-2xl shadow-black/20 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-violet-400/20 hover:bg-white/[0.065]"
                                >

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

                                            {stat.change && (
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
                                            )}

                                            <span className="text-[10px] text-slate-600">
                                                {
                                                    stat.description
                                                }
                                            </span>

                                        </div>

                                    </div>

                                </div>
                            );
                        }
                    )}

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
                                        {formatCurrency(
                                            statsData.totalRevenue
                                        )}
                                    </h3>

                                    {latestRevenue >
                                        0 && (
                                        <span className="mb-1 flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                                            <TrendingUp
                                                size={
                                                    12
                                                }
                                            />
                                            Live
                                        </span>
                                    )}

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

                                {[1, 2, 3, 4, 5].map(
                                    (item) => (
                                        <div
                                            key={
                                                item
                                            }
                                            className="border-t border-dashed border-white/[0.06]"
                                        />
                                    )
                                )}

                            </div>

                            <svg
                                className="absolute inset-0 h-full w-full overflow-visible"
                                viewBox="0 0 800 250"
                                preserveAspectRatio="none"
                            >

                                <defs>

                                    <linearGradient
                                        id="revenueGradientDynamic"
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
                                    d={
                                        chartAreaPath
                                    }
                                    fill="url(#revenueGradientDynamic)"
                                />

                                <path
                                    d={
                                        chartLinePath
                                    }
                                    fill="none"
                                    stroke="#8b5cf6"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />

                                {chartPoints.map(
                                    (
                                        point,
                                        index
                                    ) => (
                                        <g
                                            key={
                                                index
                                            }
                                        >

                                            <circle
                                                cx={
                                                    point.x
                                                }
                                                cy={
                                                    point.y
                                                }
                                                r="4"
                                                fill="#8b5cf6"
                                            />

                                            <circle
                                                cx={
                                                    point.x
                                                }
                                                cy={
                                                    point.y
                                                }
                                                r="9"
                                                fill="#8b5cf6"
                                                opacity="0.12"
                                            />

                                        </g>
                                    )
                                )}

                            </svg>

                            <div className="absolute bottom-[-25px] left-0 right-0 flex justify-between text-[9px] font-medium text-slate-600">

                                {revenueChart.length >
                                0 ? (
                                    revenueChart.map(
                                        (
                                            item,
                                            index
                                        ) => (
                                            <span
                                                key={
                                                    index
                                                }
                                            >
                                                {new Date(
                                                    item._id
                                                ).toLocaleDateString(
                                                    "en-US",
                                                    {
                                                        month: "short",
                                                        day: "2-digit",
                                                    }
                                                )}
                                            </span>
                                        )
                                    )
                                ) : (
                                    <span>
                                        No revenue
                                        data
                                    </span>
                                )}

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
                                    {Number(
                                        statsData.totalOrders ||
                                            0
                                    ).toLocaleString()}{" "}
                                    Orders
                                </h3>

                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-500/10 text-violet-300">
                                <BarChart3 size={18} />
                            </div>

                        </div>

                        <div className="mt-7 flex items-center justify-center">

                            <div
                                className="relative flex h-44 w-44 items-center justify-center rounded-full shadow-[0_0_50px_rgba(139,92,246,0.15)]"
                                style={{
                                    background: `conic-gradient(
                                        #8b5cf6 0deg ${
                                            completedPercentage *
                                            3.6
                                        }deg,
                                        #a78bfa ${
                                            completedPercentage *
                                            3.6
                                        }deg 290deg,
                                        rgba(255,255,255,0.07) 290deg 360deg
                                    )`,
                                }}
                            >

                                <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full border border-white/[0.08] bg-[#0b0d1b]">

                                    <span className="text-2xl font-bold text-white">
                                        {
                                            completedPercentage
                                        }
                                        %
                                    </span>

                                    <span className="text-[10px] text-slate-600">
                                        Completed
                                    </span>

                                </div>

                            </div>

                        </div>

                        <div className="mt-7 space-y-3">

                            {[
                                [
                                    "Delivered",
                                    deliveredOrders,
                                    "bg-violet-500",
                                ],
                                [
                                    "Processing",
                                    processingOrders,
                                    "bg-violet-300",
                                ],
                                [
                                    "Shipped",
                                    shippedOrders,
                                    "bg-indigo-400",
                                ],
                                [
                                    "Pending",
                                    pendingOrders,
                                    "bg-amber-400",
                                ],
                                [
                                    "Cancelled",
                                    cancelledOrders,
                                    "bg-red-400",
                                ],
                            ].map(
                                ([
                                    label,
                                    value,
                                    color,
                                ]) => (
                                    <div
                                        key={
                                            label
                                        }
                                        className="flex items-center justify-between"
                                    >

                                        <div className="flex items-center gap-2">

                                            <span
                                                className={`h-2 w-2 rounded-full ${color}`}
                                            />

                                            <span className="text-[11px] text-slate-500">
                                                {
                                                    label
                                                }
                                            </span>

                                        </div>

                                        <span className="text-[11px] font-bold text-slate-300">
                                            {
                                                value
                                            }
                                        </span>

                                    </div>
                                )
                            )}

                            {otherOrders > 0 && (
                                <div className="flex items-center justify-between">

                                    <div className="flex items-center gap-2">

                                        <span className="h-2 w-2 rounded-full bg-slate-600" />

                                        <span className="text-[11px] text-slate-500">
                                            Other
                                        </span>

                                    </div>

                                    <span className="text-[11px] font-bold text-slate-300">
                                        {
                                            otherOrders
                                        }
                                    </span>

                                </div>
                            )}

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
                                    Latest customer
                                    transactions
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
                                        ].map(
                                            (
                                                heading
                                            ) => (
                                                <th
                                                    key={
                                                        heading
                                                    }
                                                    className="px-5 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-slate-600"
                                                >
                                                    {
                                                        heading
                                                    }
                                                </th>
                                            )
                                        )}

                                    </tr>

                                </thead>

                                <tbody>

                                    {recentOrders.length >
                                    0 ? (
                                        recentOrders.map(
                                            (
                                                order
                                            ) => {

                                                const customerName =
                                                    order.user
                                                        ? `${order.user.firstName || ""} ${
                                                              order.user.lastName ||
                                                              ""
                                                          }`.trim()
                                                        : order
                                                              .shippingAddress
                                                              ?.fullName ||
                                                          "Guest Customer";

                                                const initials =
                                                    customerName
                                                        .split(
                                                            " "
                                                        )
                                                        .filter(
                                                            Boolean
                                                        )
                                                        .map(
                                                            (
                                                                name
                                                            ) =>
                                                                name[0]
                                                        )
                                                        .join(
                                                            ""
                                                        )
                                                        .slice(
                                                            0,
                                                            2
                                                        )
                                                        .toUpperCase();

                                                const productName =
                                                    order
                                                        .items?.[0]
                                                        ?.product
                                                        ?.name ||
                                                    "Multiple Products";

                                                return (
                                                    <tr
                                                        key={
                                                            order._id
                                                        }
                                                        className="border-b border-white/[0.05] transition last:border-0 hover:bg-white/[0.025]"
                                                    >

                                                        <td className="px-5 py-4">

                                                            <p className="text-[11px] font-bold text-slate-300">
                                                                #
                                                                {order.trackingNumber ||
                                                                    order._id?.slice(
                                                                        -6
                                                                    )}
                                                            </p>

                                                            <p className="mt-1 text-[9px] text-slate-600">
                                                                {order.createdAt
                                                                    ? new Date(
                                                                          order.createdAt
                                                                      ).toLocaleDateString(
                                                                          "en-US",
                                                                          {
                                                                              month: "short",
                                                                              day: "2-digit",
                                                                              year: "numeric",
                                                                          }
                                                                      )
                                                                    : "-"}
                                                            </p>

                                                        </td>

                                                        <td className="px-5 py-4">

                                                            <div className="flex items-center gap-2">

                                                                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-violet-400/10 bg-violet-500/10 text-[9px] font-bold text-violet-300">
                                                                    {initials ||
                                                                        "GU"}
                                                                </div>

                                                                <span className="text-[11px] font-semibold text-slate-300">
                                                                    {
                                                                        customerName
                                                                    }
                                                                </span>

                                                            </div>

                                                        </td>

                                                        <td className="px-5 py-4">

                                                            <span className="text-[11px] text-slate-500">
                                                                {
                                                                    productName
                                                                }
                                                            </span>

                                                            {order
                                                                .items
                                                                ?.length >
                                                                1 && (
                                                                <span className="ml-2 text-[9px] text-violet-400">
                                                                    +
                                                                    {order
                                                                        .items
                                                                        .length -
                                                                        1}{" "}
                                                                    more
                                                                </span>
                                                            )}

                                                        </td>

                                                        <td className="px-5 py-4">

                                                            <span className="text-[11px] font-bold text-slate-300">
                                                                {formatCurrency(
                                                                    order.total
                                                                )}
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

                                                                {
                                                                    order.status
                                                                }
                                                            </span>

                                                        </td>

                                                    </tr>
                                                );
                                            }
                                        )
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="px-5 py-12 text-center"
                                            >
                                                <ShoppingBag
                                                    size={
                                                        25
                                                    }
                                                    className="mx-auto text-slate-700"
                                                />

                                                <p className="mt-3 text-xs text-slate-500">
                                                    No orders
                                                    found
                                                </p>
                                            </td>
                                        </tr>
                                    )}

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

                            {topProducts.length >
                            0 ? (
                                topProducts.map(
                                    (
                                        product,
                                        index
                                    ) => (
                                        <div
                                            key={
                                                product._id ||
                                                index
                                            }
                                            className="group flex items-center gap-3 rounded-xl p-3 transition hover:bg-white/[0.035]"
                                        >

                                            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5">

                                                <img
                                                    src={
                                                        product.image ||
                                                        product.productImage ||
                                                        "https://placehold.co/100x100/111322/ffffff?text=Product"
                                                    }
                                                    alt={
                                                        product.name ||
                                                        "Product"
                                                    }
                                                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                                                />

                                            </div>

                                            <div className="min-w-0 flex-1">

                                                <p className="truncate text-[11px] font-bold text-slate-300">
                                                    {product.name ||
                                                        "Unknown Product"}
                                                </p>

                                                <p className="mt-1 text-[9px] text-slate-600">
                                                    {product.category ||
                                                        "General"}{" "}
                                                    •{" "}
                                                    {
                                                        product.sold
                                                    }{" "}
                                                    sold
                                                </p>

                                            </div>

                                            <div className="text-right">

                                                <p className="text-[11px] font-bold text-slate-300">
                                                    {formatCurrency(
                                                        product.revenue
                                                    )}
                                                </p>

                                                <p className="mt-1 text-[9px] font-bold text-violet-400">
                                                    #
                                                    {index +
                                                        1}
                                                </p>

                                            </div>

                                        </div>
                                    )
                                )
                            ) : (
                                <div className="px-3 py-10 text-center">

                                    <Package
                                        size={25}
                                        className="mx-auto text-slate-700"
                                    />

                                    <p className="mt-3 text-xs text-slate-500">
                                        No product
                                        sales yet
                                    </p>

                                </div>
                            )}

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
                                    Store Performance
                                </p>

                                <TrendingUp
                                    size={17}
                                    className="text-violet-300"
                                />

                            </div>

                            <h3 className="mt-3 text-3xl font-bold text-white">
                                {completedPercentage}%
                            </h3>

                            <p className="mt-2 text-[10px] text-violet-200/60">
                                Order completion rate
                            </p>

                            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">

                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-violet-400 to-indigo-400 shadow-lg shadow-violet-500/40 transition-all duration-700"
                                    style={{
                                        width: `${Math.min(
                                            completedPercentage,
                                            100
                                        )}%`,
                                    }}
                                />

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
                                {lowStockProducts.length >
                                0
                                    ? "Attention"
                                    : "Healthy"}
                            </span>

                        </div>

                        <p className="mt-5 text-xs font-medium text-slate-500">
                            Low Stock Items
                        </p>

                        <h3 className="mt-1 text-2xl font-bold text-white">
                            {
                                lowStockProducts.length
                            }
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
                                    Manage your store
                                    faster
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
                            ].map(
                                (action) => (
                                    <button
                                        key={
                                            action
                                        }
                                        className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2.5 text-left text-[10px] font-semibold text-slate-400 transition hover:border-violet-400/20 hover:bg-violet-500/10 hover:text-violet-300"
                                    >
                                        {
                                            action
                                        }
                                    </button>
                                )
                            )}

                        </div>

                    </div>

                </div>

                {/* =====================================================
                    FOOTER
                ====================================================== */}

                <div className="mt-8 border-t border-white/[0.06] pt-5 text-center">

                    <p className="text-[9px] text-slate-700">
                        © 2026 Admin Dashboard •
                        E-Commerce Management System
                    </p>

                </div>

            </main>
        </div>
    );
};

export default AdminDashboard;