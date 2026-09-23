"use client";

import { useRouter } from "next/navigation";
import { addProduct } from "@/lib/api/products";
import ProductForm from "@/components/ProductForm";

export default function AddProductPage() {
  const router = useRouter();

  async function handleAdd(data) {
    await addProduct(data);
    // Add successful -> products list pe wapas bhej do
    router.push("/products");
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Add Product</h1>
      <ProductForm onSubmit={handleAdd} submitLabel="Add Product" />
    </div>
  );
}