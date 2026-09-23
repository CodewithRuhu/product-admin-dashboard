"use client";

import { useEffect, useState } from "react";
import { getCategories } from "@/lib/api/products";

export default function FilterSortBar({ category, sortBy, order, onCategoryChange, onSortChange }) {
  const [categories, setCategories] = useState([]);

  // Component pehli baar mount hote hi categories ki list le aate hain
  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  function handleSortChange(e) {
    const value = e.target.value; // jaise "price-asc" ya "rating-desc"
    if (!value) {
      onSortChange("", "asc");
      return;
    }
    const [field, dir] = value.split("-");
    onSortChange(field, dir);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="border rounded px-3 py-2 text-sm"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.slug} value={cat.slug}>
            {cat.name}
          </option>
        ))}
      </select>

      <select
        value={sortBy ? `${sortBy}-${order}` : ""}
        onChange={handleSortChange}
        className="border rounded px-3 py-2 text-sm"
      >
        <option value="">Sort by</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="rating-asc">Rating: Low to High</option>
        <option value="rating-desc">Rating: High to Low</option>
        <option value="title-asc">Title: A to Z</option>
        <option value="title-desc">Title: Z to A</option>
      </select>
    </div>
  );
}