"use client";

import { useEffect, useState, useCallback } from "react";
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

export default function ProductsPage() {
  const { logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // ----- URL se current values padhna (safe defaults ke saath) -----
  const rawPage = parseInt(searchParams.get("page")) || 1;
  const page = Math.max(1, rawPage); // "?page=abc" ya negative -> 1
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

  // ----- URL update karne ka helper -----
  // updates: object jo change karna hai, jaise { page: 2 }
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

  // ----- Data fetch karna -----
  const fetchData = useCallback(
    async (signal) => {
      setLoading(true);
      setError("");
      try {
        const skip = (page - 1) * limit;
        let data;

        // IMPORTANT DECISION: API search aur category filter ek saath
        // support nahi karti. Hum decide karte hain: agar search query
        // hai, to search priority lega (category ignore hogi jab tak
        // search khaali na ho). Ye README mein bhi explain kiya jayega.
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
        // Agar request cancel hui thi (race condition fix), to error mat dikhao
        if (err.code === "ERR_CANCELED" || err.name === "CanceledError") return;
        setError(err.message || "Failed to load products.");
      } finally {
        setLoading(false);
      }
    },
    [page, limit, query, category, sortBy, order]
  );

  // ----- Jab bhi URL params change hon, naya data fetch karo -----
  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);

    // CLEANUP: agar dependencies phir se change ho jayein (naya effect
    // chalne se pehle), purani request cancel kar do. Ye "fast typing"
    // wala race condition bug isi se fix hota hai.
    return () => controller.abort();
  }, [fetchData]);

  // ----- "Wrong page number" (jaise ?page=999) handle karna -----
  const totalPages = Math.max(1, Math.ceil(total / limit));
  useEffect(() => {
    if (!loading && page > totalPages && total > 0) {
      updateParams({ page: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, totalPages, total]);

  // ----- Event handlers -----
  function handleSearch(text) {
    updateParams({ q: text, page: 1 }); // search change -> page 1 pe wapas
  }

  function handleCategoryChange(cat) {
    // Rule: category select karne par search clear kar do (kyunki API
    // dono ek saath support nahi karti)
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
      // API asal mein delete nahi karti, isliye hum UI se manually hata
      // dete hain taaki user ko change dikhe (README mein explain hoga)
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
          {/* Desktop: table. Mobile: cards. Tailwind ke hidden/block se switch hota hai */}
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