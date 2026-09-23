"use client";

import { useState } from "react";

const initialForm = {
  title: "",
  category: "",
  price: "",
  stock: "",
  description: "",
};

export default function ProductForm({ initialValues, onSubmit, submitLabel }) {
  const [form, setForm] = useState(initialValues || initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // Simple validation - har field check karta hai
  function validate() {
    const newErrors = {};
    if (!form.title || form.title.trim().length < 2) {
      newErrors.title = "Title must be at least 2 characters.";
    }
    if (!form.category) {
      newErrors.category = "Category is required.";
    }
    if (!form.price || Number(form.price) <= 0) {
      newErrors.price = "Price must be a positive number.";
    }
    if (form.stock === "" || Number(form.stock) < 0) {
      newErrors.stock = "Stock cannot be negative.";
    }
    if (!form.description || form.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters.";
    }
    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Multiple-click protection
    if (submitting) return;

    const newErrors = validate();
    setErrors(newErrors);

    // Agar koi error hai, to submit mat karo
    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        {errors.title && <p className="text-red-600 text-xs mt-1">{errors.title}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="e.g. groceries, smartphones"
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        {errors.category && <p className="text-red-600 text-xs mt-1">{errors.category}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Price</label>
          <input
            name="price"
            type="number"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {errors.price && <p className="text-red-600 text-xs mt-1">{errors.price}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Stock</label>
          <input
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {errors.stock && <p className="text-red-600 text-xs mt-1">{errors.stock}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        {errors.description && (
          <p className="text-red-600 text-xs mt-1">{errors.description}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? "Saving..." : submitLabel || "Save"}
      </button>
    </form>
  );
}