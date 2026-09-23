"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProductById } from "@/lib/api/products";
import Loader from "@/components/Loader";
import ErrorState from "@/components/ErrorState";

export default function ProductDetailsPage() {
  const params = useParams(); // { id: "5" } jaisa object URL se
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function loadProduct() {
    setLoading(true);
    setError("");
    setNotFound(false);
    try {
      const data = await getProductById(params.id);
      // DummyJSON galat id par bhi kabhi-kabhi { message: "Product not found" } deta hai
      if (!data || data.message) {
        setNotFound(true);
      } else {
        setProduct(data);
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setNotFound(true);
      } else {
        setError(err.message || "Failed to load product.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loader />;

  if (notFound) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-semibold mb-2">Product not found</h1>
        <p className="text-gray-500 mb-4">
          The product you're looking for doesn't exist.
        </p>
        <Link href="/products" className="text-blue-600 hover:underline">
          ← Back to products
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <ErrorState message={error} onRetry={loadProduct} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => router.push("/products")}
        className="text-blue-600 hover:underline mb-4"
      >
        ← Back to products
      </button>

      <div className="grid sm:grid-cols-2 gap-8">
        <div>
          <Image
            src={product.thumbnail}
            alt={product.title}
            width={400}
            height={400}
            className="rounded-lg object-cover w-full"
          />
          <div className="flex gap-2 mt-3 overflow-x-auto">
            {product.images?.slice(0, 4).map((img, i) => (
              <Image
                key={i}
                src={img}
                alt={`${product.title} ${i}`}
                width={80}
                height={80}
                className="rounded object-cover"
              />
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-semibold mb-2">{product.title}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-xl font-semibold mb-1">${product.price}</p>
          <p className="text-sm text-gray-500 mb-1">Rating: {product.rating} ⭐</p>
          <p className="text-sm text-gray-500 mb-4">Stock: {product.stock}</p>

          <Link
            href={`/products/edit/${product.id}`}
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit Product
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-3">Reviews</h2>
        {product.reviews?.length ? (
          <div className="space-y-3">
            {product.reviews.map((review, i) => (
              <div key={i} className="border-b pb-3">
                <p className="font-medium text-sm">
                  {review.reviewerName} — {review.rating} ⭐
                </p>
                <p className="text-sm text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}