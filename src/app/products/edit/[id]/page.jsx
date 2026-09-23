"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProductById, updateProduct } from "@/lib/api/products";
import ProductForm from "@/components/ProductForm";
import Loader from "@/components/Loader";
import ErrorState from "@/components/ErrorState";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function loadProduct() {
    setLoading(true);
    setError("");
    try {
      const data = await getProductById(params.id);
      setProduct(data);
    } catch (err) {
      setError(err.message || "Failed to load product.");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(data) {
    await updateProduct(params.id, data);
    router.push(`/products/${params.id}`);
  }

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} onRetry={loadProduct} />;
  if (!product) return null;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Edit Product</h1>
      <ProductForm
        initialValues={{
          title: product.title,
          category: product.category,
          price: String(product.price),
          stock: String(product.stock),
          description: product.description,
        }}
        onSubmit={handleUpdate}
        submitLabel="Save Changes"
      />
    </div>
  );
}