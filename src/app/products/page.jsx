"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getProducts, getProductsByCategory, searchProducts, deleteProduct } from "@/lib/api/products";
import Loader from "@/components/Loader";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import ConfirmDialog from "@/components/ConfirmDialog";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";
import FilterSortBar from "@/components/FilterSortBar";
import ProductTable from "@/components/ProductTable";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

function ProductsContent() {
  const { logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawPage = parseInt(searchParams.get("page")) || 1;
  const page = Math.max(1, rawPage);
  const limit = [10, 20, 50].includes(Number(searchParams.get("limit")))
    ? Number(searchParams.get("limit"))
    : 10;
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const sortBy = searchParams.get("sortBy") || "";
  const order = searchParams.get("order") || "asc";

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  function updateParams(updates) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === "" || value === undefined || value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`/products?${params.toString()}`);
  }

  const fetchData = useCallback(
    async (signal) => {
      setLoading(true);
      setError("");
      try {
        const skip = (page - 1) * limit;
        let data;

        if (query) {
          data = await searchProducts({ q: query, limit, skip, signal });
        } else if (category) {
          data = await getProductsByCategory({ category, limit, skip, signal });
        } else {
          data = await getProducts({ limit, skip, sortBy, order, signal });
        }

        setProducts(data.products || []);
        setTotal(data.total || 0);
      } catch (err) {
        if (err.code === "ERR_CANCELED" || err.name === "CanceledError") return;
        setError(err.message || "Failed to load products.");
      } finally {
        setLoading(false);
      }
    },
    [page, limit, query, category, sortBy, order]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
  }, [fetchData]);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  useEffect(() => {
    if (!loading && page > totalPages && total > 0) {
      updateParams({ page: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, totalPages, total]);

  function handleSearch(text) {
    updateParams({ q: text, page: 1 });
  }

  function handleCategoryChange(cat) {
    updateParams({ category: cat, q: "", page: 1 });
  }

  function handleSortChange(field, dir) {
    updateParams({ sortBy: field, order: dir });
  }

  function handlePageChange(newPage) {
    if (newPage < 1 || newPage > totalPages) return;
    updateParams({ page: newPage });
  }

  function handleLimitChange(newLimit) {
    updateParams({ limit: newLimit, page: 1 });
  }

  async function confirmDelete() {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    try {
      await deleteProduct(deleteTarget.id);
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setTotal((prev) => prev - 1);
      setDeleteTarget(null);
    } catch (err) {
      setError(err.message || "Failed to delete product.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Products</h1>
        <div className="flex gap-3">
          <Link
            href="/products/add"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
          >
            Add Product
          </Link>
          <button
            onClick={logout}
            className="px-4 py-2 border rounded hover:bg-gray-100 text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <SearchBar initialValue={query} onSearch={handleSearch} />
        <FilterSortBar
          category={category}
          sortBy={sortBy}
          order={order}
          onCategoryChange={handleCategoryChange}
          onSortChange={handleSortChange}
        />
      </div>

      {loading && <Loader />}

      {!loading && error && <ErrorState message={error} onRetry={() => fetchData()} />}

      {!loading && !error && products.length === 0 && (
        <EmptyState message="No products found." />
      )}

      {!loading && !error && products.length > 0 && (
        <>
          <div className="hidden md:block">
            <ProductTable products={products} onDelete={setDeleteTarget} />
          </div>
          <div className="md:hidden space-y-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onDelete={setDeleteTarget} />
            ))}
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            limit={limit}
            skip={(page - 1) * limit}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        </>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete product?"
        message={deleteTarget ? `Are you sure you want to delete "${deleteTarget.title}"?` : ""}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<Loader />}>
      <ProductsContent />
    </Suspense>
  );
}