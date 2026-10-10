

import React, { useCallback, useEffect, useMemo, useState } from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";

import AdminProducts from "../Dashboard/AdminProducts";
import AdminCategories from "../Dashboard/AdminCategories";
import AdminUser from "../Dashboard/AdminUser";
import AdminOrderNotification from "../Dashboard/AdminOrderNotification";

import {

  Activity,

  ArrowDownRight,

  ArrowUpRight,

  BarChart3,

  Bell,

  CalendarDays,

  CheckCircle2,

  ChevronDown,

  ChevronRight,

  Clock3,

  DollarSign,

  Download,

  ExternalLink,

  Filter,

  LayoutDashboard,

  Menu,

  Moon,

  MoreHorizontal,

  Package,

  RefreshCw,

  Search,

  Settings,

  ShoppingBag,

  Sparkles,

  Sun,

  Tags,

  TrendingDown,

  TrendingUp,

  Truck,

  Users,

  X,

  XCircle,

} from "lucide-react";



const API_URL = "http://localhost:3000/api/admin/dashboard";



const currency = (value) =>

  `$${Number(value || 0).toLocaleString("en-US", {

    maximumFractionDigits: 0,

  })}`;



const compactNumber = (value) =>

  Number(value || 0).toLocaleString("en-US");



const getOrderStatus = (status = "") => {

  const normalized = String(status).toLowerCase();



  if (["delivered", "completed"].includes(normalized)) {

    return {

      label: status || "Delivered",

      className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",

      Icon: CheckCircle2,

    };

  }

  if (normalized === "processing") {

    return {

      label: status,

      className: "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-300",

      Icon: Clock3,

    };

  }

  if (normalized === "shipped") {

    return {

      label: status,

      className: "border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-300",

      Icon: Truck,

    };

  }

  if (normalized === "pending") {

    return {

      label: status,

      className: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",

      Icon: Clock3,

    };

  }

  if (["cancelled", "canceled"].includes(normalized)) {

    return {

      label: status,

      className: "border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-300",

      Icon: XCircle,

    };

  }

  return {

    label: status || "Other",

    className: "border-slate-500/20 bg-slate-500/10 text-slate-600 dark:text-slate-300",

    Icon: Activity,

  };

};



const AdminDashboard = () => {

  const [activePage, setActivePage] = useState("dashboard");

  const navigate = useNavigate();



  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [theme, setTheme] = useState(() => {

    try {

      return localStorage.getItem("adminDashboardTheme") || "dark";

    } catch {

      return "dark";

    }

  });

  const [searchTerm, setSearchTerm] = useState("");

  const [period, setPeriod] = useState("7");

  const [statusFilter, setStatusFilter] = useState("all");

  const [showSearch, setShowSearch] = useState(false);

  const [showNotifications, setShowNotifications] = useState(false);

  const [showProfileMenu, setShowProfileMenu] = useState(false);



  const isDark = theme === "dark";



  useEffect(() => {

    try {

      localStorage.setItem("adminDashboardTheme", theme);

    } catch {

      // The dashboard still works when browser storage is unavailable.

    }

  }, [theme]);



  const fetchDashboard = useCallback(async (isRefresh = false) => {

    try {

      if (isRefresh) setRefreshing(true);

      else setLoading(true);



      setError("");

      const accessToken = localStorage.getItem("accessToken");



      const response = await axios.get(API_URL, {

        headers: accessToken

          ? { Authorization: `Bearer ${accessToken}` }

          : {},

        withCredentials: true,

      });



      if (response.data?.statusText === "success") {

        setDashboard(response.data.data || {});

      } else {

        throw new Error(

          response.data?.message || "Failed to load dashboard data."

        );

      }

    } catch (err) {

      console.error("Admin Dashboard Error:", err);

      setError(

        err.response?.data?.message ||

        err.message ||

        "Unable to load dashboard. Please try again."

      );

    } finally {

      setLoading(false);

      setRefreshing(false);

    }

  }, []);



  useEffect(() => {

    fetchDashboard();

    const intervalId = window.setInterval(() => fetchDashboard(true), 60000);

    return () => window.clearInterval(intervalId);

  }, [fetchDashboard]);



  useEffect(() => {

    const onKeyDown = (event) => {

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {

        event.preventDefault();

        setShowSearch(true);

        window.setTimeout(() => {

          document.getElementById("dashboard-search")?.focus();

        }, 0);

      }

      if (event.key === "Escape") {

        setShowSearch(false);

        setShowNotifications(false);

        setShowProfileMenu(false);

      }

    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);

  }, []);



  const statsData = dashboard?.stats || {

    totalRevenue: 0,

    totalOrders: 0,

    totalProducts: 0,

    totalCustomers: 0,

  };

  const recentOrders = dashboard?.recentOrders || [];

  const topProducts = dashboard?.topProducts || [];

  const orderSummary = dashboard?.orderSummary || [];

  const revenueChart = dashboard?.revenueChart || [];

  const lowStockProducts = dashboard?.lowStockProducts || [];



  const summaryMap = useMemo(

    () =>

      orderSummary.reduce((acc, item) => {

        const key = item?._id || "Other";

        acc[key] = (acc[key] || 0) + Number(item?.count || 0);

        return acc;

      }, {}),

    [orderSummary]

  );



  const deliveredOrders = summaryMap.Delivered || summaryMap.Completed || 0;

  const processingOrders = summaryMap.Processing || 0;

  const shippedOrders = summaryMap.Shipped || 0;

  const pendingOrders = summaryMap.Pending || 0;

  const cancelledOrders = (summaryMap.Cancelled || 0) + (summaryMap.Canceled || 0);

  const otherOrders = Math.max(

    0,

    Number(statsData.totalOrders || 0) -

    deliveredOrders -

    processingOrders -

    shippedOrders -

    pendingOrders -

    cancelledOrders

  );

  const completedPercentage =

    Number(statsData.totalOrders || 0) > 0

      ? Math.min(

        100,

        Math.round(

          (deliveredOrders / Number(statsData.totalOrders || 1)) * 100

        )

      )

      : 0;



  const filteredRevenue = useMemo(() => {

    const days = Number(period);

    const cutoff = new Date();

    cutoff.setDate(cutoff.getDate() - (days - 1));

    return revenueChart.filter((item) => {

      if (!item?._id) return true;

      const date = new Date(item._id);

      return Number.isNaN(date.getTime()) || date >= cutoff;

    });

  }, [revenueChart, period]);



  const chartPoints = useMemo(() => {

    if (!filteredRevenue.length) return [];

    const values = filteredRevenue.map((item) => Number(item?.revenue || 0));

    const maxRevenue = Math.max(...values, 1);

    return filteredRevenue.map((item, index) => ({

      x: filteredRevenue.length === 1 ? 400 : (index / (filteredRevenue.length - 1)) * 800,

      y: 220 - (Number(item?.revenue || 0) / maxRevenue) * 180,

      revenue: Number(item?.revenue || 0),

      date: item?._id,

    }));

  }, [filteredRevenue]);



  const chartLinePath = chartPoints.length

    ? chartPoints

      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)

      .join(" ")

    : "M0 220 L800 220";

  const chartAreaPath = chartPoints.length

    ? `${chartLinePath} L800 250 L0 250 Z`

    : "M0 220 L800 220 L800 250 L0 250 Z";



  const filteredOrders = useMemo(() => {

    const query = searchTerm.trim().toLowerCase();

    return recentOrders.filter((order) => {

      const customerName = order.user

        ? `${order.user.firstName || ""} ${order.user.lastName || ""}`.trim()

        : order.shippingAddress?.fullName || "Guest Customer";

      const tracking = order.trackingNumber || order._id || "";

      const productName =

        order.items?.[0]?.product?.name || "Multiple Products";

      const matchesQuery =

        !query ||

        customerName.toLowerCase().includes(query) ||

        String(tracking).toLowerCase().includes(query) ||

        productName.toLowerCase().includes(query);

      const matchesStatus =

        statusFilter === "all" ||

        String(order.status || "").toLowerCase() === statusFilter;

      return matchesQuery && matchesStatus;

    });

  }, [recentOrders, searchTerm, statusFilter]);



  const stats = [

    {

      title: "Total Revenue",

      value: currency(statsData.totalRevenue),

      note: "All-time revenue",

      icon: DollarSign,

      iconClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",

      accent: "from-emerald-500/15",

    },

    {

      title: "Total Orders",

      value: compactNumber(statsData.totalOrders),

      note: "All orders",

      icon: ShoppingBag,

      iconClass: "bg-violet-500/10 text-violet-600 dark:text-violet-300",

      accent: "from-violet-500/15",

    },

    {

      title: "Total Products",

      value: compactNumber(statsData.totalProducts),

      note: "Store products",

      icon: Package,

      iconClass: "bg-sky-500/10 text-sky-600 dark:text-sky-300",

      accent: "from-sky-500/15",

    },

    {

      title: "Total Customers",

      value: compactNumber(statsData.totalCustomers),

      note: "Registered users",

      icon: Users,

      iconClass: "bg-amber-500/10 text-amber-700 dark:text-amber-300",

      accent: "from-amber-500/15",

    },

  ];



  const dateRange = useMemo(() => {

    const end = new Date();

    const start = new Date();

    start.setDate(start.getDate() - (Number(period) - 1));

    const formatDate = (date) =>

      date.toLocaleDateString("en-US", { month: "short", day: "2-digit" });

    return `${formatDate(start)} – ${formatDate(end)}`;

  }, [period]);



  const goTo = (path) => navigate(path);



  const exportOrders = () => {

    const rows = [

      ["Order", "Customer", "Product", "Amount", "Status", "Date"],

      ...filteredOrders.map((order) => {

        const customerName = order.user

          ? `${order.user.firstName || ""} ${order.user.lastName || ""}`.trim()

          : order.shippingAddress?.fullName || "Guest Customer";

        return [

          order.trackingNumber || order._id || "",

          customerName,

          order.items?.[0]?.product?.name || "Multiple Products",

          Number(order.total || 0),

          order.status || "Unknown",

          order.createdAt ? new Date(order.createdAt).toISOString() : "",

        ];

      }),

    ];

    const csv = rows

      .map((row) =>

        row

          .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)

          .join(",")

      )

      .join("\r\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "admin-recent-orders.csv";

    link.click();

    URL.revokeObjectURL(url);

  };



  const cardClass = `rounded-2xl border shadow-sm transition-colors ${isDark

      ? "border-white/[0.09] bg-slate-900/75 shadow-black/10"

      : "border-slate-200 bg-white shadow-slate-200/60"

    }`;

  const mutedText = isDark ? "text-slate-400" : "text-slate-500";

  const subtleText = isDark ? "text-slate-500" : "text-slate-400";

  const headingText = isDark ? "text-white" : "text-slate-900";

  const pageClass = isDark

    ? "dark min-h-screen bg-[#080b16] text-white"

    : "min-h-screen bg-slate-50 text-slate-900";



  if (loading) {

    return (

      <div className={`${pageClass} flex min-h-screen items-center justify-center px-5`}>

        <div className={`${cardClass} w-full max-w-sm p-9 text-center`}>

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-500">

            <RefreshCw size={24} className="animate-spin" />

          </div>

          <h2 className={`mt-5 text-lg font-bold ${headingText}`}>Loading dashboard</h2>

          <p className={`mt-2 text-sm ${mutedText}`}>Fetching your store analytics…</p>

        </div>

      </div>

    );

  }



  if (error && !dashboard) {

    return (

      <div className={`${pageClass} flex min-h-screen items-center justify-center px-5`}>

        <div className={`${cardClass} w-full max-w-md p-8 text-center`}>

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500">

            <XCircle size={25} />

          </div>

          <h2 className={`mt-5 text-xl font-bold ${headingText}`}>Dashboard unavailable</h2>

          <p className={`mt-2 text-sm leading-6 ${mutedText}`}>{error}</p>

          <button

            onClick={() => fetchDashboard()}

            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"

          >

            <RefreshCw size={15} /> Try again

          </button>

        </div>

      </div>

    );

  }



  return (

    <div className={pageClass}>

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className={`absolute -left-40 -top-40 h-[440px] w-[440px] rounded-full blur-[130px] ${isDark ? "bg-violet-700/15" : "bg-violet-300/30"}`} />

        <div className={`absolute right-[-160px] top-[15%] h-[420px] w-[420px] rounded-full blur-[130px] ${isDark ? "bg-indigo-600/10" : "bg-sky-200/40"}`} />

      </div>



      <header className={`sticky top-0 z-40 border-b backdrop-blur-2xl ${isDark ? "border-white/[0.08] bg-[#080b16]/85" : "border-slate-200 bg-white/85"}`}>

        <div className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

          <div className="flex min-w-0 items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/20">

              <LayoutDashboard size={19} />

            </div>

            <div className="min-w-0">

              <div className={`hidden items-center gap-1.5 text-xs sm:flex ${subtleText}`}>

                <span>Admin</span><ChevronRight size={12} /><span className={mutedText}>Dashboard</span>

              </div>

              <h1 className={`truncate text-base font-bold sm:text-lg ${headingText}`}>Dashboard Overview</h1>

            </div>

          </div>



          <div className="flex items-center gap-2">

            <div className="relative hidden md:block">

              <Search size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 ${subtleText}`} />

              <input

                id="dashboard-search"

                value={searchTerm}

                onChange={(event) => setSearchTerm(event.target.value)}

                onFocus={() => setShowSearch(true)}

                placeholder="Search orders…"

                className={`h-10 w-48 rounded-xl border pl-9 pr-14 text-xs outline-none transition focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 lg:w-64 ${isDark ? "border-white/10 bg-white/[0.04] text-white placeholder:text-slate-500" : "border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400"}`}

              />

              <span className={`absolute right-2 top-1/2 -translate-y-1/2 rounded border px-1.5 py-0.5 text-[9px] ${isDark ? "border-white/10 text-slate-500" : "border-slate-200 text-slate-400"}`}>⌘ K</span>

            </div>

            <button

              onClick={() => setShowSearch((value) => !value)}

              className={`flex h-10 w-10 items-center justify-center rounded-xl border md:hidden ${isDark ? "border-white/10 bg-white/[0.04] text-slate-300" : "border-slate-200 bg-white text-slate-600"}`}

              aria-label="Toggle search"

            >

              {showSearch ? <X size={17} /> : <Search size={17} />}

            </button>

            <div className="hidden items-center gap-1.5 lg:flex">
              {[
                ["dashboard", "Overview", LayoutDashboard],
                ["products", "Products", Package],
                ["categories", "Categories", Tags],
                ["users", "Users", Users],
                ["orders", "Orders", ShoppingBag],
              ].map(([page, label, Icon]) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => {
                    setActivePage(page);
                    setShowNotifications(false);
                    setShowProfileMenu(false);
                  }}
                  className={`inline-flex h-9 items-center gap-1.5 rounded-xl border px-2.5 text-xs font-semibold transition ${activePage === page ? "border-violet-500/30 bg-violet-500/10 text-violet-500" : isDark ? "border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"}`}
                  aria-pressed={activePage === page}
                >
                  <Icon size={14} />{label}
                </button>
              ))}
            </div>
            <div className="lg:hidden">
              <select
                value={activePage}
                onChange={(event) => setActivePage(event.target.value)}
                aria-label="Admin section"
                className={`h-10 max-w-[130px] rounded-xl border px-2 text-xs font-semibold outline-none ${isDark ? "border-white/10 bg-slate-900 text-slate-200" : "border-slate-200 bg-white text-slate-700"}`}
              >
                <option value="dashboard">Overview</option>
                <option value="products">Products</option>
                <option value="categories">Categories</option>
                <option value="users">Users</option>
                <option value="orders">Orders</option>
              </select>
            </div>

            <button

              onClick={() => setTheme(isDark ? "light" : "dark")}

              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${isDark ? "border-white/10 bg-white/[0.04] text-amber-300 hover:bg-white/[0.08]" : "border-slate-200 bg-white text-indigo-600 hover:bg-slate-100"}`}

              title={`Switch to ${isDark ? "light" : "dark"} mode`}

              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}

            >

              {isDark ? <Sun size={17} /> : <Moon size={17} />}

            </button>

            <button

              onClick={() => fetchDashboard(true)}

              disabled={refreshing}

              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition disabled:opacity-50 ${isDark ? "border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"}`}

              title="Refresh dashboard"

              aria-label="Refresh dashboard"

            >

              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />

            </button>

            <div className="relative">

              <button

                onClick={() => {

                  setShowNotifications((value) => !value);

                  setShowProfileMenu(false);

                }}

                className={`relative flex h-10 w-10 items-center justify-center rounded-xl border transition ${isDark ? "border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"}`}

                aria-label="Notifications"

              >

                <Bell size={17} />

                {lowStockProducts.length > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-current" />}

              </button>

              {showNotifications && (

                <div className={`absolute right-0 top-12 z-50 w-72 rounded-2xl border p-4 shadow-xl ${isDark ? "border-white/10 bg-slate-900" : "border-slate-200 bg-white"}`}>

                  <div className="flex items-center justify-between">

                    <p className={`text-sm font-bold ${headingText}`}>Notifications</p>

                    <button onClick={() => setShowNotifications(false)} aria-label="Close notifications"><X size={15} className={mutedText} /></button>

                  </div>

                  {lowStockProducts.length ? (

                    <div className="mt-3 rounded-xl bg-amber-500/10 p-3">

                      <p className="text-xs font-semibold text-amber-600 dark:text-amber-300">{lowStockProducts.length} low-stock item(s)</p>

                      <p className={`mt-1 text-xs ${mutedText}`}>Review inventory to avoid running out of stock.</p>

                      <button onClick={() => goTo("/admin/products")} className="mt-2 text-xs font-semibold text-violet-500">Manage inventory <ArrowUpRight size={12} className="inline" /></button>

                    </div>

                  ) : (

                    <p className={`mt-4 text-xs ${mutedText}`}>You're all caught up. No low-stock alerts.</p>

                  )}

                </div>

              )}

            </div>

            <div className="relative">

              <button

                onClick={() => {

                  setShowProfileMenu((value) => !value);

                  setShowNotifications(false);

                }}

                className={`flex h-10 items-center gap-2 rounded-xl border px-2 transition ${isDark ? "border-white/10 bg-white/[0.04] hover:bg-white/[0.08]" : "border-slate-200 bg-white hover:bg-slate-100"}`}

              >

                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-white"><Users size={14} /></div>

                <span className={`hidden text-xs font-semibold sm:block ${headingText}`}>Admin</span>

                <ChevronDown size={13} className={mutedText} />

              </button>

              {showProfileMenu && (

                <div className={`absolute right-0 top-12 z-50 w-44 rounded-xl border p-1.5 shadow-xl ${isDark ? "border-white/10 bg-slate-900" : "border-slate-200 bg-white"}`}>

                  <button onClick={() => goTo("/admin/settings")} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs ${mutedText} hover:bg-violet-500/10 hover:text-violet-500`}><Settings size={14} /> Settings</button>

                  <button onClick={() => setTheme(isDark ? "light" : "dark")} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs ${mutedText} hover:bg-violet-500/10 hover:text-violet-500`}>{isDark ? <Sun size={14} /> : <Moon size={14} />} Switch theme</button>

                </div>

              )}

            </div>

          </div>

        </div>

        {showSearch && (

          <div className="border-t border-slate-500/10 px-4 py-3 md:hidden">

            <div className="relative mx-auto max-w-[1600px]">

              <Search size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 ${subtleText}`} />

              <input

                autoFocus

                value={searchTerm}

                onChange={(event) => setSearchTerm(event.target.value)}

                placeholder="Search by customer, product or order…"

                className={`h-10 w-full rounded-xl border pl-9 pr-3 text-xs outline-none focus:border-violet-500/50 ${isDark ? "border-white/10 bg-white/[0.04] text-white placeholder:text-slate-500" : "border-slate-200 bg-white text-slate-800 placeholder:text-slate-400"}`}

              />

            </div>

          </div>

        )}

      </header>



      <main className="relative z-10 mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        {activePage === "products" ? (
          <AdminProducts theme={theme} />
        ) : activePage === "categories" ? (
          <AdminCategories theme={theme} />
        ) : activePage === "users" ? (
          <AdminUser theme={theme} />
        ) : activePage === "orders" ? (
          <AdminOrderNotification theme={theme} />
        ) : (
          <>
        {error && (

          <div className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">

            <p>{error} Showing the last available data.</p>

            <button onClick={() => fetchDashboard(true)} className="shrink-0 font-semibold underline">Retry</button>

          </div>

        )}



        <section className="mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

          <div>

            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-300">

              <Sparkles size={13} /> Store overview

            </div>

            <h2 className={`text-3xl font-bold tracking-tight sm:text-4xl ${headingText}`}>Welcome back, Admin <span aria-hidden="true">👋</span></h2>

            <p className={`mt-2 max-w-xl text-sm ${mutedText}`}>Here's what's happening with your store today. Here's your latest performance at a glance.</p>

          </div>

          <div className={`inline-flex h-11 items-center gap-2 self-start rounded-xl border px-4 text-xs font-semibold lg:self-auto ${isDark ? "border-white/10 bg-white/[0.04] text-slate-300" : "border-slate-200 bg-white text-slate-600"}`}>

            <CalendarDays size={15} className="text-violet-500" /> {dateRange}

          </div>

        </section>



        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {stats.map((stat) => {

            const Icon = stat.icon;

            return (

              <article key={stat.title} className={`group relative overflow-hidden ${cardClass} p-5 hover:-translate-y-0.5 hover:border-violet-500/30`}>

                <div className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${stat.accent} to-transparent opacity-70`} />

                <div className="relative flex items-start justify-between">

                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconClass}`}><Icon size={19} /></div>

                  <button onClick={() => goTo(stat.title === "Total Revenue" ? "/admin/orders" : stat.title === "Total Orders" ? "/admin/orders" : stat.title === "Total Products" ? "/admin/products" : "/admin/users")} className={`rounded-lg p-1.5 transition hover:bg-violet-500/10 hover:text-violet-500 ${subtleText}`} aria-label={`View ${stat.title}`}><ArrowUpRight size={17} /></button>

                </div>

                <p className={`relative mt-5 text-sm font-medium ${mutedText}`}>{stat.title}</p>

                <h3 className={`relative mt-1 text-2xl font-bold tracking-tight sm:text-3xl ${headingText}`}>{stat.value}</h3>

                <div className="relative mt-3 flex items-center gap-2">

                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${isDark ? "bg-emerald-500/10 text-emerald-300" : "bg-emerald-50 text-emerald-700"}`}><TrendingUp size={11} /> Live data</span>

                  <span className={`text-[10px] ${subtleText}`}>{stat.note}</span>

                </div>

              </article>

            );

          })}

        </section>



        <section className="mt-5 grid gap-5 xl:grid-cols-3">

          <article className={`${cardClass} relative overflow-hidden p-5 sm:p-6 xl:col-span-2`}>

            <div className="pointer-events-none absolute right-0 top-0 h-44 w-44 rounded-full bg-violet-500/10 blur-[80px]" />

            <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

              <div>

                <div className="flex items-center gap-2">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500"><Activity size={16} /></div>

                  <p className={`text-sm font-semibold ${mutedText}`}>Revenue analytics</p>

                </div>

                <div className="mt-3 flex flex-wrap items-end gap-3">

                  <h3 className={`text-3xl font-bold tracking-tight ${headingText}`}>{currency(statsData.totalRevenue)}</h3>

                  <span className="mb-1 inline-flex items-center gap-1 text-xs font-semibold text-emerald-500"><TrendingUp size={13} /> Revenue overview</span>

                </div>

              </div>

              <label className="flex items-center gap-2">

                <span className={`text-xs ${mutedText}`}>Period</span>

                <select value={period} onChange={(event) => setPeriod(event.target.value)} className={`rounded-xl border px-3 py-2.5 text-xs font-semibold outline-none focus:border-violet-500/50 ${isDark ? "border-white/10 bg-slate-900 text-slate-200" : "border-slate-200 bg-white text-slate-700"}`}>

                  <option value="7">Last 7 days</option>

                  <option value="30">Last 30 days</option>

                  <option value="90">Last 3 months</option>

                </select>

              </label>

            </div>



            <div className="relative mt-8 h-[245px]">

              <div className="absolute inset-0 flex flex-col justify-between">

                {[0, 1, 2, 3, 4].map((line) => <div key={line} className={`border-t border-dashed ${isDark ? "border-white/[0.07]" : "border-slate-200"}`} />)}

              </div>

              <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 800 250" preserveAspectRatio="none" role="img" aria-label="Revenue trend chart">

                <defs>

                  <linearGradient id="revenueAreaGradient" x1="0" x2="0" y1="0" y2="1">

                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />

                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />

                  </linearGradient>

                </defs>

                <path d={chartAreaPath} fill="url(#revenueAreaGradient)" />

                <path d={chartLinePath} fill="none" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                {chartPoints.map((point, index) => <g key={`${point.date || "point"}-${index}`}><circle cx={point.x} cy={point.y} r="8" fill="#8b5cf6" opacity=".12" /><circle cx={point.x} cy={point.y} r="3.5" fill="#8b5cf6" /></g>)}

              </svg>

              <div className={`absolute -bottom-6 left-0 right-0 flex justify-between gap-2 text-[9px] ${subtleText}`}>

                {filteredRevenue.length ? filteredRevenue.map((item, index) => (

                  <span key={`${item._id}-${index}`} className="truncate">

                    {new Date(item._id).toLocaleDateString("en-US", { month: "short", day: "numeric" })}

                  </span>

                )) : <span>No revenue data for this period</span>}

              </div>

            </div>

            <div className={`mt-10 flex items-center justify-between border-t pt-4 ${isDark ? "border-white/[0.07]" : "border-slate-100"}`}>

              <p className={`text-xs ${mutedText}`}>Revenue shown for selected period</p>

              <span className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold ${isDark ? "bg-violet-500/10 text-violet-300" : "bg-violet-50 text-violet-700"}`}>{filteredRevenue.length} data points</span>

            </div>

          </article>



          <article className={`${cardClass} p-5 sm:p-6`}>

            <div className="flex items-center justify-between">

              <div>

                <p className={`text-sm font-semibold ${mutedText}`}>Order summary</p>

                <h3 className={`mt-1 text-xl font-bold ${headingText}`}>{compactNumber(statsData.totalOrders)} orders</h3>

              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500"><BarChart3 size={18} /></div>

            </div>

            <div className="mt-7 flex justify-center">

              <div className="relative flex h-44 w-44 items-center justify-center rounded-full" style={{ background: `conic-gradient(#8b5cf6 0% ${completedPercentage}%, ${isDark ? "#a78bfa" : "#c4b5fd"} ${completedPercentage}% 80%, ${isDark ? "rgba(255,255,255,.07)" : "#e2e8f0"} 80% 100%)` }}>

                <div className={`flex h-32 w-32 flex-col items-center justify-center rounded-full border ${isDark ? "border-white/10 bg-slate-900" : "border-slate-100 bg-white"}`}>

                  <span className={`text-3xl font-bold ${headingText}`}>{completedPercentage}%</span>

                  <span className={`mt-1 text-[11px] ${mutedText}`}>Delivered</span>

                </div>

              </div>

            </div>

            <div className="mt-7 space-y-3">

              {[

                ["Delivered", deliveredOrders, "bg-violet-500"],

                ["Processing", processingOrders, "bg-violet-300"],

                ["Shipped", shippedOrders, "bg-indigo-400"],

                ["Pending", pendingOrders, "bg-amber-400"],

                ["Cancelled", cancelledOrders, "bg-rose-400"],

                ...(otherOrders ? [["Other", otherOrders, "bg-slate-400"]] : []),

              ].map(([label, value, color]) => (

                <div key={label} className="flex items-center justify-between gap-3">

                  <div className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${color}`} /><span className={`text-xs ${mutedText}`}>{label}</span></div>

                  <span className={`text-xs font-bold ${headingText}`}>{compactNumber(value)}</span>

                </div>

              ))}

            </div>

          </article>

        </section>



        <section className="mt-5 grid gap-5 xl:grid-cols-3">

          <article className={`${cardClass} overflow-hidden xl:col-span-2`}>

            <div className={`flex flex-col gap-4 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between ${isDark ? "border-white/[0.07]" : "border-slate-100"}`}>

              <div>

                <div className="flex items-center gap-2"><h3 className={`font-bold ${headingText}`}>Recent orders</h3><span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-300">LIVE</span></div>

                <p className={`mt-1 text-xs ${subtleText}`}>Latest customer transactions</p>

              </div>

              <div className="flex flex-wrap items-center gap-2">

                <label className="relative">

                  <Filter size={13} className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${subtleText}`} />

                  <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className={`h-9 rounded-lg border pl-8 pr-2 text-xs outline-none focus:border-violet-500/50 ${isDark ? "border-white/10 bg-slate-900 text-slate-300" : "border-slate-200 bg-white text-slate-600"}`}>

                    <option value="all">All statuses</option><option value="pending">Pending</option><option value="processing">Processing</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option>

                  </select>

                </label>

                <button onClick={exportOrders} className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition hover:border-violet-500/30 hover:text-violet-500 ${isDark ? "border-white/10 text-slate-300" : "border-slate-200 text-slate-600"}`}><Download size={13} /> Export CSV</button>

                <button onClick={() => goTo("/admin/orders")} className="inline-flex h-9 items-center gap-1 rounded-lg px-2 text-xs font-bold text-violet-500 hover:bg-violet-500/10">View all <ArrowUpRight size={13} /></button>

              </div>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full min-w-[720px] text-left">

                <thead>

                  <tr className={isDark ? "bg-white/[0.02]" : "bg-slate-50"}>

                    {["Order", "Customer", "Product", "Amount", "Status"].map((heading) => <th key={heading} className={`px-5 py-3 text-[10px] font-bold uppercase tracking-wider ${subtleText}`}>{heading}</th>)}

                  </tr>

                </thead>

                <tbody>

                  {filteredOrders.length ? filteredOrders.map((order) => {

                    const customerName = order.user

                      ? `${order.user.firstName || ""} ${order.user.lastName || ""}`.trim()

                      : order.shippingAddress?.fullName || "Guest Customer";

                    const initials = customerName.split(" ").filter(Boolean).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "GU";

                    const productName = order.items?.[0]?.product?.name || "Multiple Products";

                    const status = getOrderStatus(order.status);

                    const StatusIcon = status.Icon;

                    return (

                      <tr key={order._id} className={`border-t transition ${isDark ? "border-white/[0.05] hover:bg-white/[0.025]" : "border-slate-100 hover:bg-slate-50"}`}>

                        <td className="px-5 py-4"><p className={`text-xs font-bold ${headingText}`}>#{order.trackingNumber || order._id?.slice(-6) || "—"}</p><p className={`mt-1 text-[10px] ${subtleText}`}>{order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "—"}</p></td>

                        <td className="px-5 py-4"><div className="flex items-center gap-2.5"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-[10px] font-bold text-violet-500">{initials}</div><span className={`text-xs font-semibold ${headingText}`}>{customerName}</span></div></td>

                        <td className="px-5 py-4"><span className={`text-xs ${mutedText}`}>{productName}</span>{order.items?.length > 1 && <span className="ml-2 text-[10px] text-violet-500">+{order.items.length - 1} more</span>}</td>

                        <td className="px-5 py-4"><span className={`text-xs font-bold ${headingText}`}>{currency(order.total)}</span></td>

                        <td className="px-5 py-4"><span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${status.className}`}><StatusIcon size={12} />{status.label}</span></td>

                      </tr>

                    );

                  }) : (

                    <tr><td colSpan={5} className={`px-5 py-12 text-center text-sm ${mutedText}`}>{searchTerm || statusFilter !== "all" ? "No orders match your search or filters." : "No orders found yet."}</td></tr>

                  )}

                </tbody>

              </table>

            </div>

            <div className={`flex items-center justify-between border-t px-5 py-3 ${isDark ? "border-white/[0.07]" : "border-slate-100"}`}>

              <p className={`text-[11px] ${subtleText}`}>Showing {filteredOrders.length} of {recentOrders.length} recent orders</p>

              {(searchTerm || statusFilter !== "all") && <button onClick={() => { setSearchTerm(""); setStatusFilter("all"); }} className="text-xs font-semibold text-violet-500 hover:underline">Clear filters</button>}

            </div>

          </article>



          <article className={`${cardClass} overflow-hidden`}>

            <div className={`flex items-center justify-between border-b px-5 py-4 ${isDark ? "border-white/[0.07]" : "border-slate-100"}`}>

              <div><h3 className={`font-bold ${headingText}`}>Top products</h3><p className={`mt-1 text-xs ${subtleText}`}>Best-selling products</p></div>

              <button onClick={() => goTo("/admin/products")} aria-label="View products" className={`rounded-lg p-1.5 ${mutedText} hover:bg-violet-500/10 hover:text-violet-500`}><MoreHorizontal size={18} /></button>

            </div>

            <div className="p-3">

              {topProducts.length ? topProducts.slice(0, 6).map((product, index) => (

                <div key={product._id || index} className={`group flex items-center gap-3 rounded-xl p-3 transition ${isDark ? "hover:bg-white/[0.035]" : "hover:bg-slate-50"}`}>

                  <div className={`h-11 w-11 shrink-0 overflow-hidden rounded-xl border ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"}`}>

                    <img src={product.image || product.productImage || "https://placehold.co/100x100/e2e8f0/64748b?text=Product"} alt={product.name || "Product"} loading="lazy" className="h-full w-full object-cover transition duration-300 group-hover:scale-105" onError={(event) => { event.currentTarget.src = "https://placehold.co/100x100/e2e8f0/64748b?text=Product"; }} />

                  </div>

                  <div className="min-w-0 flex-1"><p className={`truncate text-xs font-bold ${headingText}`}>{product.name || "Unknown product"}</p><p className={`mt-1 truncate text-[10px] ${subtleText}`}>{typeof product.category === "object" ? product.category?.name || "General" : product.category || "General"} · {compactNumber(product.sold)} sold</p></div>

                  <div className="text-right"><p className={`text-xs font-bold ${headingText}`}>{currency(product.revenue)}</p><p className="mt-1 text-[10px] font-bold text-violet-500">#{index + 1}</p></div>

                </div>

              )) : <div className={`px-3 py-10 text-center text-sm ${mutedText}`}><Package size={25} className="mx-auto mb-3 opacity-40" />No product sales yet</div>}

            </div>

            <div className={`border-t p-4 ${isDark ? "border-white/[0.07]" : "border-slate-100"}`}>

              <button onClick={() => goTo("/admin/products")} className={`flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-bold transition hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-500 ${isDark ? "border-white/10 text-slate-300" : "border-slate-200 text-slate-600"}`}>View all products <ExternalLink size={13} /></button>

            </div>

          </article>

        </section>



        <section className="mt-5 grid gap-5 md:grid-cols-3">

          <article className="relative overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-600/15 via-violet-500/5 to-indigo-600/10 p-6">

            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-violet-500/15 blur-3xl" />

            <div className="relative flex items-center justify-between"><p className={`text-sm font-semibold ${isDark ? "text-violet-200" : "text-violet-700"}`}>Store performance</p><TrendingUp size={18} className="text-violet-500" /></div>

            <h3 className={`relative mt-4 text-3xl font-bold ${headingText}`}>{completedPercentage}%</h3>

            <p className={`relative mt-1 text-xs ${mutedText}`}>Order completion rate</p>

            <div className={`relative mt-5 h-2 overflow-hidden rounded-full ${isDark ? "bg-white/10" : "bg-violet-100"}`}><div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-700" style={{ width: `${completedPercentage}%` }} /></div>

          </article>



          <article className={`${cardClass} p-6`}>

            <div className="flex items-center justify-between"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-300"><Package size={17} /></div><span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${lowStockProducts.length ? "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300" : "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"}`}>{lowStockProducts.length ? "Attention needed" : "Healthy"}</span></div>

            <p className={`mt-5 text-sm font-medium ${mutedText}`}>Low-stock items</p>

            <h3 className={`mt-1 text-3xl font-bold ${headingText}`}>{compactNumber(lowStockProducts.length)}</h3>

            <button onClick={() => goTo("/admin/products")} className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-violet-500 hover:underline">Manage inventory <ChevronRight size={13} /></button>

            {lowStockProducts.length > 0 && <div className="mt-4 space-y-2">{lowStockProducts.slice(0, 2).map((product, index) => <div key={product._id || index} className={`flex items-center justify-between gap-2 text-xs ${mutedText}`}><span className="truncate">{product.name || "Unnamed product"}</span><span className="shrink-0 font-semibold text-amber-600 dark:text-amber-300">{product.stock ?? product.quantity ?? "Low"}</span></div>)}</div>}

          </article>



          <article className={`${cardClass} p-6`}>

            <div className="flex items-center justify-between"><div><p className={`text-sm font-bold ${headingText}`}>Quick actions</p><p className={`mt-1 text-xs ${subtleText}`}>Manage your store faster</p></div><Settings size={18} className={subtleText} /></div>

            <div className="mt-5 grid grid-cols-2 gap-2">

              {[

                ["Add product", "/admin/products/create", Package],

                ["Add category", "/admin/categories/create", LayoutDashboard],

                ["View orders", "/admin/orders", ShoppingBag],

                ["Manage users", "/admin/users", Users],

              ].map(([label, path, Icon]) => (

                <button key={label} onClick={() => goTo(path)} className={`flex min-h-12 items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs font-semibold transition hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-500 ${isDark ? "border-white/[0.08] bg-white/[0.02] text-slate-300" : "border-slate-200 bg-slate-50 text-slate-600"}`}><Icon size={14} />{label}</button>

              ))}

            </div>

          </article>

        </section>



        <footer className={`mt-8 border-t pt-5 text-center text-[11px] ${isDark ? "border-white/[0.07] text-slate-600" : "border-slate-200 text-slate-400"}`}>

          © {new Date().getFullYear()} Admin Dashboard <span className="mx-1">·</span> E-Commerce Management System

        </footer>
          </>
        )}

      </main>

    </div>

  );

};



export default AdminDashboard;
