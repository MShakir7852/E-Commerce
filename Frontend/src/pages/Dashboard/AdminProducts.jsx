import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  AlertTriangle, ChevronLeft, ChevronRight, Filter, ImagePlus, Package,
  Pencil, Plus, RefreshCw, Search, Tags, Trash2, X, Boxes, DollarSign,
} from "lucide-react";
import { toast } from "sonner";

const API_URL = "http://localhost:3000/api";
const ENDPOINTS = {
  products: `${API_URL}/products/all`,
  create: `${API_URL}/products/create`,
  update: (id) => `${API_URL}/products/update/${id}`,
  delete: (id) => `${API_URL}/products/delete/${id}`,
  categories: `${API_URL}/categories/all`,
};

const EMPTY_FORM = {
  name: "", description: "", price: "", discountPrice: "", stock: "",
  category: "", isActive: true,
};

const getErrorMessage = (error) =>
  error.response?.data?.message || error.response?.data?.error || error.message || "Request failed.";

const getArray = (response, kind) => {
  const body = response?.data;
  const options = [body?.data?.[kind], body?.[kind], body?.data, body];
  return options.find(Array.isArray) || [];
};

const categoryId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return String(value._id || value.id || "");
};

const imageUrl = (product) => {
  const value = product?.productImage ?? product?.image ?? product?.imageUrl;
  if (typeof value === "string") return value;
  if (value && typeof value === "object") return value.secure_url || value.url || "";
  return "";
};

const AdminProducts = ({ theme: dashboardTheme }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [localTheme, setLocalTheme] = useState(() => {
    try { return localStorage.getItem("adminDashboardTheme") || "dark"; }
    catch { return "dark"; }
  });
  const theme = dashboardTheme || localTheme;
  const isDark = theme === "dark";

  const tokenConfig = useCallback((multipart = false) => {
    const token = localStorage.getItem("accessToken");
    return {
      withCredentials: true,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(multipart ? { "Content-Type": "multipart/form-data" } : {}),
      },
    };
  }, []);

  const fetchProducts = useCallback(async (silent = false) => {
    try {
      if (silent) setRefreshing(true);
      else setLoading(true);
      const response = await axios.get(ENDPOINTS.products, tokenConfig());
      if (response.data?.statusText === "error") {
        throw new Error(response.data?.message || "Unable to fetch products.");
      }
      setProducts(getArray(response, "products"));
    } catch (error) {
      console.error("Products fetch failed:", error);
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [tokenConfig]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(ENDPOINTS.categories, tokenConfig());
      setCategories(getArray(response, "categories"));
    } catch (error) {
      console.error("Categories fetch failed:", error);
      setCategories([]);
    }
  }, [tokenConfig]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  useEffect(() => {
    if (!preview || !preview.startsWith("blob:")) return undefined;
    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => {
      const id = categoryId(product.category);
      const categoryName = typeof product.category === "object"
        ? product.category?.name || ""
        : categories.find((item) => categoryId(item) === id)?.name || product.category || "";
      const matchesQuery = !query ||
        String(product.name || "").toLowerCase().includes(query) ||
        String(product.description || "").toLowerCase().includes(query) ||
        String(categoryName).toLowerCase().includes(query);
      const matchesCategory = categoryFilter === "all" || id === categoryFilter;
      const matchesStatus = statusFilter === "all" ||
        (statusFilter === "active" && product.isActive !== false) ||
        (statusFilter === "inactive" && product.isActive === false);
      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [products, categories, search, categoryFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const visibleProducts = filteredProducts.slice((safePage - 1) * pageSize, safePage * pageSize);

  useEffect(() => { setPage(1); }, [search, categoryFilter, statusFilter, pageSize]);

  const stats = useMemo(() => ({
    total: products.length,
    active: products.filter((p) => p.isActive !== false).length,
    lowStock: products.filter((p) => Number(p.stock || 0) <= 5).length,
    inventoryValue: products.reduce((sum, p) => sum + Number(p.price || 0) * Number(p.stock || 0), 0),
  }), [products]);

  const openCreate = () => {
    setEditing(null); setForm(EMPTY_FORM); setSelectedFile(null); setPreview(""); setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setForm({
      name: product.name || "", description: product.description || "",
      price: product.price ?? "", discountPrice: product.discountPrice ?? "",
      stock: product.stock ?? "", category: categoryId(product.category),
      isActive: product.isActive !== false,
    });
    setSelectedFile(null); setPreview(imageUrl(product)); setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false); setEditing(null); setForm(EMPTY_FORM); setSelectedFile(null); setPreview("");
  };

  const changeField = (event) => {
    const { name, value, checked, type } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const chooseImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Choose a JPG, PNG or WEBP image."); event.target.value = ""; return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be 5 MB or smaller."); event.target.value = ""; return;
    }
    setSelectedFile(file); setPreview(URL.createObjectURL(file));
  };

  const submitProduct = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) return toast.error("Product name is required.");
    if (form.price === "" || !Number.isFinite(Number(form.price)) || Number(form.price) < 0) return toast.error("Enter a valid price.");
    if (form.stock === "" || !Number.isInteger(Number(form.stock)) || Number(form.stock) < 0) return toast.error("Enter a valid whole-number stock quantity.");
    if (form.discountPrice !== "" && (Number(form.discountPrice) < 0 || Number(form.discountPrice) > Number(form.price))) return toast.error("Discount price must be between 0 and the regular price.");
    if (!form.category) return toast.error("Please select a category.");
    if (!editing && !selectedFile) return toast.error("Please choose a product image.");

    const data = new FormData();
    data.append("name", form.name.trim());
    data.append("description", form.description.trim());
    data.append("price", String(Number(form.price)));
    data.append("stock", String(Number(form.stock)));
    data.append("category", form.category);
    data.append("isActive", String(form.isActive));
    if (form.discountPrice !== "") data.append("discountPrice", String(Number(form.discountPrice)));
    if (selectedFile) data.append("productImage", selectedFile);

    try {
      setSaving(true);
      if (editing) {
        await axios.put(ENDPOINTS.update(editing._id), data, tokenConfig(true));
        toast.success("Product updated successfully.");
      } else {
        await axios.post(ENDPOINTS.create, data, tokenConfig(true));
        toast.success("Product created successfully.");
      }
      setModalOpen(false); setEditing(null); setForm(EMPTY_FORM); setSelectedFile(null); setPreview("");
      await fetchProducts(true);
    } catch (error) {
      console.error("Save product failed:", error);
      toast.error(getErrorMessage(error));
    } finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    if (!deleteTarget?._id) return;
    try {
      setDeleting(true);
      await axios.delete(ENDPOINTS.delete(deleteTarget._id), tokenConfig());
      toast.success("Product deleted successfully.");
      setDeleteTarget(null);
      await fetchProducts(true);
    } catch (error) {
      console.error("Delete product failed:", error);
      toast.error(getErrorMessage(error));
    } finally { setDeleting(false); }
  };

  const pageClass = isDark ? "min-h-screen bg-[#080b16] text-white" : "min-h-screen bg-slate-50 text-slate-900";
  const cardClass = isDark ? "border-white/[0.09] bg-slate-900/75" : "border-slate-200 bg-white";
  const headingClass = isDark ? "text-white" : "text-slate-900";
  const mutedClass = isDark ? "text-slate-400" : "text-slate-500";
  const inputClass = `w-full rounded-xl border px-3.5 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15 ${isDark ? "border-white/10 bg-white/[0.04] text-white placeholder:text-slate-500" : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"}`;
  const buttonClass = `inline-flex items-center justify-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition ${isDark ? "border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.07]" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`;

  return (
    <div className={pageClass}>
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className={`mb-2 flex items-center gap-2 text-xs ${mutedClass}`}><Package size={14} /> Admin <span>/</span> <span className="text-violet-500">Products</span></div>
            <h1 className={`text-2xl font-bold tracking-tight sm:text-3xl ${headingClass}`}>Products Management</h1>
            <p className={`mt-2 text-sm ${mutedClass}`}>Manage products, categories, pricing, stock and images.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => fetchProducts(true)} disabled={refreshing} className={buttonClass}><RefreshCw size={15} className={refreshing ? "animate-spin" : ""} /> Refresh</button>
            <button type="button" onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 hover:bg-violet-500"><Plus size={17} /> Add product</button>
          </div>
        </div>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total products", value: stats.total, Icon: Package, color: "violet" },
            { label: "Active products", value: stats.active, Icon: Tags, color: "emerald" },
            { label: "Low stock (≤ 5)", value: stats.lowStock, Icon: Boxes, color: "amber" },
            { label: "Inventory value", value: `$${stats.inventoryValue.toLocaleString("en-US", { maximumFractionDigits: 2 })}`, Icon: DollarSign, color: "sky" },
          ].map(({ label, value, Icon, color }) => {
            const colors = {
              violet: "bg-violet-500/10 text-violet-500", emerald: "bg-emerald-500/10 text-emerald-500",
              amber: "bg-amber-500/10 text-amber-500", sky: "bg-sky-500/10 text-sky-500",
            };
            return <article key={label} className={`rounded-2xl border p-5 shadow-sm ${cardClass}`}><div className="flex items-center justify-between"><p className={`text-sm ${mutedClass}`}>{label}</p><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors[color]}`}><Icon size={19} /></span></div><p className={`mt-4 text-2xl font-bold ${headingClass}`}>{value}</p></article>;
          })}
        </section>

        <section className={`mt-6 overflow-hidden rounded-2xl border shadow-sm ${cardClass}`}>
          <div className={`border-b p-4 sm:p-5 ${isDark ? "border-white/[0.07]" : "border-slate-100"}`}>
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div><h2 className={`text-lg font-bold ${headingClass}`}>All products</h2><p className={`mt-1 text-xs ${mutedClass}`}>{filteredProducts.length} matching products</p></div>
              <div className="grid gap-2 sm:grid-cols-2 xl:flex">
                <label className="relative sm:col-span-2 xl:col-span-1"><Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${mutedClass}`} /><input value={search} onChange={(e) => setSearch(e.target.value)} type="search" placeholder="Search products..." className={`${inputClass} pl-9 xl:w-64`} /></label>
                <label className="relative"><Filter size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${mutedClass}`} /><select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className={`${inputClass} pl-9`}><option value="all">All categories</option>{categories.map((c) => <option key={c._id} value={categoryId(c)}>{c.name}</option>)}</select></label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={inputClass} aria-label="Filter by status"><option value="all">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option></select>
                <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} className={inputClass} aria-label="Products per page"><option value={8}>8 per page</option><option value={12}>12 per page</option><option value={20}>20 per page</option></select>
              </div>
            </div>
          </div>

          {loading ? <div className={`flex min-h-60 items-center justify-center gap-3 ${mutedClass}`}><RefreshCw size={22} className="animate-spin text-violet-500" /> Loading products...</div> : <>
            <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left">
              <thead><tr className={isDark ? "bg-white/[0.025]" : "bg-slate-50"}>{["Product", "Category", "Price", "Stock", "Status", "Actions"].map((label) => <th key={label} className={`px-5 py-4 text-[10px] font-bold uppercase tracking-wider ${mutedClass}`}>{label}</th>)}</tr></thead>
              <tbody>
                {visibleProducts.map((product) => {
                  const category = typeof product.category === "object" ? product.category?.name : categories.find((c) => categoryId(c) === categoryId(product.category))?.name || product.category;
                  const src = imageUrl(product);
                  return <tr key={product._id} className={`border-t transition ${isDark ? "border-white/[0.06] hover:bg-white/[0.025]" : "border-slate-100 hover:bg-slate-50"}`}>
                    <td className="px-5 py-4"><div className="flex items-center gap-3"><div className={`h-12 w-12 shrink-0 overflow-hidden rounded-xl border ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"}`}>{src ? <img src={src} alt={product.name || "Product"} className="h-full w-full object-cover" loading="lazy" /> : <div className={`flex h-full items-center justify-center ${mutedClass}`}><Package size={20} /></div>}</div><div className="max-w-64"><p className={`truncate text-sm font-semibold ${headingClass}`}>{product.name || "Unnamed product"}</p><p className={`mt-1 line-clamp-1 max-w-56 text-xs ${mutedClass}`}>{product.description || "No description"}</p></div></div></td>
                    <td className={`px-5 py-4 text-sm ${mutedClass}`}>{category || "Uncategorized"}</td>
                    <td className="px-5 py-4"><p className={`text-sm font-bold ${headingClass}`}>${Number(product.price || 0).toLocaleString()}</p>{product.discountPrice !== undefined && product.discountPrice !== null && product.discountPrice !== "" && <p className="mt-1 text-xs text-emerald-500">Sale: ${Number(product.discountPrice).toLocaleString()}</p>}</td>
                    <td className="px-5 py-4"><span className={`text-sm font-semibold ${Number(product.stock || 0) <= 5 ? "text-amber-500" : headingClass}`}>{product.stock ?? 0}</span>{Number(product.stock || 0) <= 5 && <p className="mt-1 text-[10px] text-amber-500">Low stock</p>}</td>
                    <td className="px-5 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${product.isActive === false ? "bg-slate-500/10 text-slate-500" : "bg-emerald-500/10 text-emerald-500"}`}>{product.isActive === false ? "Inactive" : "Active"}</span></td>
                    <td className="px-5 py-4"><div className="flex items-center gap-2"><button type="button" onClick={() => openEdit(product)} title="Edit product" className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500 hover:bg-violet-500 hover:text-white"><Pencil size={15} /></button><button type="button" onClick={() => setDeleteTarget(product)} title="Delete product" className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white"><Trash2 size={15} /></button></div></td>
                  </tr>;
                })}
                {!visibleProducts.length && <tr><td colSpan={6} className={`px-5 py-14 text-center ${mutedClass}`}><Package size={30} className="mx-auto mb-3 opacity-50" /><p className={`text-sm font-semibold ${headingClass}`}>No products found</p><p className="mt-1 text-xs">Try another search/filter or add a product.</p></td></tr>}
              </tbody>
            </table></div>
            <div className={`flex flex-col gap-3 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-between ${isDark ? "border-white/[0.07]" : "border-slate-100"}`}>
              <p className={`text-xs ${mutedClass}`}>{filteredProducts.length ? `Showing ${(safePage - 1) * pageSize + 1}–${Math.min(safePage * pageSize, filteredProducts.length)} of ${filteredProducts.length}` : "Showing 0 products"}</p>
              <div className="flex items-center gap-2"><button disabled={safePage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className={`${buttonClass} disabled:opacity-40`}><ChevronLeft size={15} /> Previous</button><span className={`px-2 text-xs font-semibold ${mutedClass}`}>{safePage} / {totalPages}</span><button disabled={safePage >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className={`${buttonClass} disabled:opacity-40`}>Next <ChevronRight size={15} /></button></div>
            </div>
          </>}
        </section>
      </div>

      {modalOpen && <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/65 p-3 backdrop-blur-sm sm:p-6" onMouseDown={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
        <section role="dialog" aria-modal="true" aria-labelledby="product-modal-title" className={`my-auto w-full max-w-2xl overflow-hidden rounded-2xl border shadow-2xl ${isDark ? "border-white/10 bg-[#0d1220] text-white" : "border-slate-200 bg-white text-slate-900"}`}>
          <div className={`flex items-center justify-between border-b px-5 py-4 ${isDark ? "border-white/[0.08]" : "border-slate-100"}`}><div><h2 id="product-modal-title" className="text-lg font-bold">{editing ? "Edit product" : "Add new product"}</h2><p className={`mt-1 text-xs ${mutedClass}`}>Complete the product details below.</p></div><button type="button" onClick={closeModal} disabled={saving} className={buttonClass} aria-label="Close modal"><X size={17} /></button></div>
          <form onSubmit={submitProduct}>
            <div className="max-h-[72vh] space-y-5 overflow-y-auto p-5 sm:p-6"><div className="grid gap-5 sm:grid-cols-2">
              <label className="sm:col-span-2"><span className={`mb-2 block text-xs font-semibold ${mutedClass}`}>Product name *</span><input name="name" value={form.name} onChange={changeField} required maxLength={150} placeholder="Enter product name" className={inputClass} /></label>
              <label className="sm:col-span-2"><span className={`mb-2 block text-xs font-semibold ${mutedClass}`}>Description</span><textarea name="description" value={form.description} onChange={changeField} rows={3} placeholder="Describe the product..." className={`${inputClass} resize-y`} /></label>
              <label><span className={`mb-2 block text-xs font-semibold ${mutedClass}`}>Price *</span><input name="price" type="number" min="0" step="0.01" value={form.price} onChange={changeField} required className={inputClass} placeholder="0.00" /></label>
              <label><span className={`mb-2 block text-xs font-semibold ${mutedClass}`}>Discount price</span><input name="discountPrice" type="number" min="0" step="0.01" value={form.discountPrice} onChange={changeField} className={inputClass} placeholder="Optional" /></label>
              <label><span className={`mb-2 block text-xs font-semibold ${mutedClass}`}>Stock quantity *</span><input name="stock" type="number" min="0" step="1" value={form.stock} onChange={changeField} required className={inputClass} placeholder="Available stock" /></label>
              <label><span className={`mb-2 block text-xs font-semibold ${mutedClass}`}>Category *</span><select name="category" value={form.category} onChange={changeField} required className={inputClass}><option value="">Select category</option>{categories.map((c) => <option key={c._id} value={categoryId(c)}>{c.name}</option>)}</select></label>
              <div className="sm:col-span-2"><span className={`mb-2 block text-xs font-semibold ${mutedClass}`}>Product image {editing ? "(optional)" : "*"}</span><label className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-5 transition hover:border-violet-500 ${isDark ? "border-white/15 bg-white/[0.025]" : "border-slate-300 bg-slate-50"}`}>{preview ? <img src={preview} alt="Product preview" className="mb-3 h-32 w-32 rounded-xl object-cover" /> : <ImagePlus size={30} className="mb-3 text-violet-500" />}<span className="text-sm font-semibold">{selectedFile?.name || "Choose product image"}</span><span className={`mt-1 text-xs ${mutedClass}`}>JPG, PNG or WEBP · Maximum 5 MB</span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseImage} className="sr-only" /></label></div>
              <label className={`flex items-center justify-between gap-3 rounded-xl border p-4 sm:col-span-2 ${isDark ? "border-white/10 bg-white/[0.025]" : "border-slate-200 bg-slate-50"}`}><span><span className="block text-sm font-semibold">Active product</span><span className={`mt-1 block text-xs ${mutedClass}`}>Make this product available in the store.</span></span><input type="checkbox" name="isActive" checked={form.isActive} onChange={changeField} className="h-4 w-4 accent-violet-600" /></label>
            </div></div>
            <div className={`flex flex-col-reverse gap-2 border-t p-5 sm:flex-row sm:justify-end ${isDark ? "border-white/[0.08]" : "border-slate-100"}`}><button type="button" onClick={closeModal} disabled={saving} className={buttonClass}>Cancel</button><button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-60">{saving && <RefreshCw size={15} className="animate-spin" />}{saving ? "Saving..." : editing ? "Update product" : "Create product"}</button></div>
          </form>
        </section>
      </div>}

      {deleteTarget && <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm"><section role="alertdialog" aria-modal="true" aria-labelledby="delete-product-title" className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${isDark ? "border-white/10 bg-[#0d1220] text-white" : "border-slate-200 bg-white text-slate-900"}`}><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500"><AlertTriangle size={23} /></div><h2 id="delete-product-title" className="mt-4 text-lg font-bold">Delete this product?</h2><p className={`mt-2 text-sm leading-6 ${mutedClass}`}>Are you sure you want to delete <strong className={headingClass}>{deleteTarget.name}</strong>? This action cannot be undone.</p><div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button type="button" disabled={deleting} onClick={() => setDeleteTarget(null)} className={buttonClass}>Cancel</button><button type="button" disabled={deleting} onClick={confirmDelete} className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-500 disabled:opacity-60">{deleting && <RefreshCw size={15} className="animate-spin" />}{deleting ? "Deleting..." : "Yes, delete product"}</button></div></section></div>}
    </div>
  );
};

export default AdminProducts;
