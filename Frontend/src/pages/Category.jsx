import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FolderOpen,
  ArrowRight,
  RefreshCw,
  AlertCircle,
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
        "http://localhost:3000/api/categories/create"
      );

      console.log("Categories:", response.data);

      // Agar backend direct array return karta hai
      if (Array.isArray(response.data)) {
        setCategories(response.data);
      }

      // Agar backend { data: [...] } return karta hai
      else if (Array.isArray(response.data.data)) {
        setCategories(response.data.data);
      }

      // Agar backend { categories: [...] } return karta hai
      else if (Array.isArray(response.data.categories)) {
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

  // Loading UI
  if (loading) {
    return (
      <section className="min-h-[400px] bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 text-center">
            <div className="mx-auto h-8 w-48 animate-pulse rounded-lg bg-gray-200"></div>
            <div className="mx-auto mt-3 h-4 w-72 animate-pulse rounded bg-gray-200"></div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                <div className="h-52 animate-pulse bg-gray-200"></div>

                <div className="space-y-3 p-5">
                  <div className="h-5 w-32 animate-pulse rounded bg-gray-200"></div>
                  <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
                  <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error UI
  if (error) {
    return (
      <section className="flex min-h-[400px] items-center justify-center bg-gray-50 px-4 py-16">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-7 w-7 text-red-500" />
          </div>

          <h2 className="text-xl font-bold text-gray-900">
            Something went wrong
          </h2>

          <p className="mt-2 text-sm text-gray-500">{error}</p>

          <button
            onClick={fetchCategories}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <RefreshCw size={17} />
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="mb-10 text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <FolderOpen className="h-6 w-6 text-blue-600" />

            <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Shop by Category
            </span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Explore Our Categories
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-gray-500">
            Find your favorite products by exploring our different categories.
          </p>
        </div>

        {/* Empty State */}
        {categories.length === 0 ? (
          <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
            <FolderOpen className="mx-auto h-12 w-12 text-gray-300" />

            <h3 className="mt-4 text-xl font-semibold text-gray-800">
              No Categories Found
            </h3>

            <p className="mt-2 text-gray-500">
              There are currently no categories available.
            </p>
          </div>
        ) : (
          /* Categories Grid */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => (
              <Link
                to={`/category/${category._id}`}
                key={category._id}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-gray-100">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
                      <FolderOpen className="h-16 w-16 text-blue-400" />
                    </div>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/20"></div>

                  {/* Active Badge */}
                  {category.isActive !== false && (
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-green-600 shadow">
                      Active
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-bold capitalize text-gray-900 transition group-hover:text-blue-600">
                        {category.name}
                      </h3>

                      {category.description && (
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
                          {category.description}
                        </p>
                      )}
                    </div>

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 transition group-hover:bg-blue-600">
                      <ArrowRight className="h-4 w-4 text-blue-600 transition group-hover:text-white" />
                    </div>
                  </div>

                  {/* Bottom */}
                  <div className="mt-5 border-t border-gray-100 pt-4">
                    <span className="text-sm font-semibold text-blue-600">
                      View Products
                    </span>
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